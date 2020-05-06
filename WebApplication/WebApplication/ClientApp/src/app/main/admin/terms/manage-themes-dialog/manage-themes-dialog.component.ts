import { Component, Inject, OnDestroy, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocomplete, MatAutocompleteSelectedEvent } from "@angular/material";
import { Subject, Observable } from "rxjs";
import { takeUntil, startWith, map } from "rxjs/operators";
import { ThemeModel } from "../../../../../models/themes/theme.model";
import { DialogService } from "../../../../services/dialog.service";
import { TermsService } from "../../../../services/term.service";
import { ThemesService } from "../../../../services/themes.service";
import { UsabilitiesService } from "../../../../services/usabilities.service";
import { TermModel } from "../../../../../models/terms/term.model";
import { IdValueModel } from "../../../../../models/id-value.model";
import { ThemeToTermModel } from "../../../../../models/terms/theme-to-term.model";

@Component({
  selector: 'manage-themes-dialog',
  templateUrl: './manage-themes-dialog.component.html',
  styleUrls: ['./manage-themes-dialog.component.scss'],
})
export class ManageThemesDialogComponent implements OnInit, OnDestroy {

  term: TermModel;
  themesList: ThemeModel[] = [];
  filteredThemes: Observable<ThemeModel[]>;
  form: FormGroup;

  @ViewChild('themeInput', { static: false }) themeInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  private _unsubscribe: Subject<any>;

  constructor(
    private _themesService: ThemesService,
    public dialogRef: MatDialogRef<ManageThemesDialogComponent>,
    private _formBuilder: FormBuilder,
    private _usabilities: UsabilitiesService,
    private _dialogService: DialogService,
    private _termService: TermsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    this.term = data.term;

    this._unsubscribe = new Subject<any>();
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  ngOnInit() {
    this.form = this.createForm();

    this._themesService.onThemesChanged
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(themes => {
        this.themesList = themes;
      });
  }

  get themeControl() {
    return this.form.controls['theme'];
  }
  get themeIdControl() {
    return this.form.controls['themeId'];
  }

  close(): void {
    this.dialogRef.close();
  }

  createForm(): FormGroup {
    let form = this._formBuilder.group({
      theme: [null, [Validators.required, this.themeValidator]],
      themeId: [null, [Validators.required]]
    });

    this.filteredThemes = form.controls['theme'].valueChanges.pipe(
      startWith(null),
      map((theme: string | null) => theme ? this._filter(theme) : this.themesList.slice()));

    return form;
  }

  themeValidator(control: FormControl): { [s: string]: boolean } {
    if (control.parent != null &&
      control.parent.controls != null &&
      control.parent.controls['themeId'].value == null)
      return { selectValue: true };

    return;
  }

  removeTheme(item: IdValueModel) {
    let request = new ThemeToTermModel({ themeId: item.id, termId: this.term.id });
    this._termService.removeThemeFromTerm.next(request);

    let index = this.term.themes.findIndex(v => v.id == item.id);
    this.term.themes.splice(index, 1);
  }

  addTheme() {
    if (!this.form.valid) {
      this._usabilities.touchForm(this.form);
      this._dialogService.showSnackBar('Перевірте форму!');
      return;
    }

    let request = new ThemeToTermModel({ themeId: this.themeIdControl.value, termId: this.term.id });
    this._termService.assignThemeToTerm.next(request);

    this.term.themes.push({ id: this.themeIdControl.value, value: this.themeControl.value } as IdValueModel);

    this.form = this.createForm();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.themeControl.setValue(event.option.value.name);
    this.themeIdControl.setValue(event.option.value.id);
    this.themeControl.updateValueAndValidity();
  }

  inputKeyPress() {
    this.themeIdControl.setValue(null);
    this.themeControl.updateValueAndValidity();
  }

  private _filter(value: string): ThemeModel[] {
    if (typeof (value) !== 'string') return;

    const filterValue = value.toLowerCase();
    return this.themesList.filter(theme => theme.name.toLowerCase().indexOf(filterValue) === 0);
  }
}
