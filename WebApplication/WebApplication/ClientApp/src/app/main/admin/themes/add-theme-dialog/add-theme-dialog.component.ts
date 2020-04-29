import { Component, OnDestroy, OnInit, Inject, ViewChild, ElementRef } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { ThemesService } from "../../../../services/themes.service";
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent } from "@angular/material";
import { ThemeModel } from "../../../../../models/themes/theme.model";
import { startWith, map, takeUntil } from "rxjs/operators";
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { UsabilitiesService } from "../../../../services/usabilities.service";
import { DialogService } from "../../../../services/dialog.service";
import { AddThemeModel } from "../../../../../models/themes/add-theme.model";

@Component({
  selector: 'add-theme-dialog',
  templateUrl: './add-theme-dialog.component.html',
  styleUrls: ['./add-theme-dialog.component.scss'],
})
export class AddThemeDialogComponent implements OnInit, OnDestroy {

  form: FormGroup;
  edit: ThemeModel;
  isEdit: boolean = false;

  //theme chips
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredThemes: Observable<ThemeModel[]>;
  themes: ThemeModel[] = [];
  themesList: ThemeModel[] = [];

  @ViewChild('themeInput', { static: false }) themeInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;


  private _unsubscribe: Subject<any>;

  constructor(
    private _themesService: ThemesService,
    public dialogRef: MatDialogRef<AddThemeDialogComponent>,
    private _formBuilder: FormBuilder,
    private _usabilities: UsabilitiesService,
    private _dialogService: DialogService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    if (data.edit != null) {
      this.isEdit = true;
      this.edit = data.edit;
    }
    else {
      this.edit = {} as ThemeModel;
    }

    this._unsubscribe = new Subject<any>();
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  ngOnInit() {
    this.form = this.createForm(this.edit);

    this._themesService.onThemesChanged
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(themes => {
        this.themesList = themes;
      });

    this.filteredThemes = this.form.controls['parents'].valueChanges.pipe(
      startWith(null),
      map((theme: string | null) => theme ? this._filter(theme) : this.themesList.slice()));
  }

  close(): void {
    this.dialogRef.close();
  }

  createForm(theme: ThemeModel) {
    let form = this._formBuilder.group({
      name: [theme.name || null, [Validators.required]],
      parents: [null, []]
    });
    return form;
  }

  addTheme() {
    if (!this.form.valid) {
      this._usabilities.touchForm(this.form);
      this._dialogService.showSnackBar('Перевірте форму!');
      return;
    }

    let request = new AddThemeModel({});
    request.name = this.form.value.name;
    request.parents = this.themes.map(v => v.id);

    this._themesService.addTheme.next(request);
    this.close();
  }

  editTheme() {
    if (!this.form.valid) {
      this._usabilities.touchForm(this.form);
      this._dialogService.showSnackBar('Перевірте форму!');
      return;
    }

    let request = new AddThemeModel({});
    request.id = this.edit.id;
    request.name = this.form.value.name;

    this._themesService.updateTheme.next(request);
    this.close();
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if (value != null && value.trim().length > 0) {
      let find = this.themesList.find(v => v.name.toLowerCase().indexOf(value.trim()) > 0);

      if(find != null)
        this.themes.push(find);
    }

    if (input) {
      input.value = '';
    }

    this.form.controls['parents'].setValue(null);
  }

  remove(theme: ThemeModel): void {
    const index = this.themes.indexOf(theme);

    if (index >= 0) {
      this.themes.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.themes.push(event.option.value);
    this.themeInput.nativeElement.value = '';
    this.form.controls['parents'].setValue(null);
  }

  private _filter(value: string): ThemeModel[] {
    if (typeof(value) !== 'string') return;

    const filterValue = value.toLowerCase();
    return this.themesList.filter(theme => theme.name.toLowerCase().indexOf(filterValue) === 0);
  }
}
