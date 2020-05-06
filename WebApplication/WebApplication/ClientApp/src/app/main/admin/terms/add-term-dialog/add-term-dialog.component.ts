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
import { TermModel } from "../../../../../models/terms/term.model";
import { EditTermModel } from "../../../../../models/terms/edit-term.model";
import { TermsService } from "../../../../services/term.service";

@Component({
  selector: 'add-term-dialog',
  templateUrl: './add-term-dialog.component.html',
  styleUrls: ['./add-term-dialog.component.scss'],
})
export class AddTermDialogComponent implements OnInit, OnDestroy {

  form: FormGroup;
  edit: TermModel;
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
    public dialogRef: MatDialogRef<AddTermDialogComponent>,
    private _formBuilder: FormBuilder,
    private _usabilities: UsabilitiesService,
    private _dialogService: DialogService,
    private _termService: TermsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    if (data.edit != null) {
      this.isEdit = true;
      this.edit = data.edit;
    }
    else {
      this.edit = {} as TermModel;
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

    this.filteredThemes = this.form.controls['themes'].valueChanges.pipe(
      startWith(null),
      map((theme: string | null) => theme ? this._filter(theme) : this.themesList.slice()));
  }

  close(): void {
    this.dialogRef.close();
  }

  createForm(term: TermModel) {
    let form = this._formBuilder.group({
      name: [term.name || null, [Validators.required]],
      description: [term.description || null, [Validators.required]],
      source: [term.source || null, [Validators.required]],
      isFullMatch: [term.isFullMatch || false, []],
      themes: [null, []],
    });
    return form;
  }

  addTheme() {
    if (!this.form.valid) {
      this._usabilities.touchForm(this.form);
      this._dialogService.showSnackBar('Перевірте форму!');
      return;
    }

    let request = new EditTermModel(this.form.value);
    request.themes = this.themes.map(v => v.id);

    this._termService.addTerm.next(request);
    this.close();
  }

  editTheme() {
    if (!this.form.valid) {
      this._usabilities.touchForm(this.form);
      this._dialogService.showSnackBar('Перевірте форму!');
      return;
    }

    let request = new EditTermModel(this.form.value);
    request.id = this.edit.id;

    this._termService.updateTerm.next(request);
    this.close();
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if (value != null && value.trim().length > 0) {
      let find = this.themesList.find(v => v.name.toLowerCase().indexOf(value.trim()) > 0);

      if(find != null)
        this.themes.push(find);
    }

    if (input) {
      input.value = '';
    }

    this.form.controls['themes'].setValue(null);
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
    this.form.controls['themes'].setValue(null);
  }

  private _filter(value: string): ThemeModel[] {
    if (typeof(value) !== 'string') return;

    const filterValue = value.toLowerCase();
    return this.themesList.filter(theme => theme.name.toLowerCase().indexOf(filterValue) === 0);
  }
}
