import { Component, OnDestroy, OnInit, ViewChild, ElementRef, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { Subject, Observable } from "rxjs";
import { ContentService } from "../../../services/content.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { trigger, state, style, transition, animate } from "@angular/animations";
import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { ThemeModel } from "../../../../models/themes/theme.model";
import { MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent } from "@angular/material";
import { takeUntil, startWith, map } from "rxjs/operators";
import { IdValueModel } from "../../../../models/id-value.model";
import { GetContentRequest } from "../../../../models/content/get-content-request.model";
import { PagingList } from "../../../../models/paging-list.model";
import { TermContentModel } from "../../../../models/content/term-content.model";

@Component({
  selector: 'find-terms',
  templateUrl: './find.component.html',
  styleUrls: ['./find.component.scss'],
  animations: [
    trigger('collapsable', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class FindComponent implements OnInit, OnDestroy {

  @Output()
  onFind: EventEmitter<any>;

  form: FormGroup;

  moreOpened: boolean = false;

  //theme chips
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredThemes: Observable<IdValueModel[]>;
  themes: IdValueModel[] = [];
  themesList: IdValueModel[] = [];

  @ViewChild('themeInput', { static: false }) themeInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  request: GetContentRequest;

  private _unsubscribe: Subject<any>;

  constructor (
    private _router: Router,
    private _contentService: ContentService,
    private _formBuilder: FormBuilder,
  ) {
    this.onFind = new EventEmitter();

    this._unsubscribe = new Subject<any>();
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  ngOnInit() {
    this.request = this._contentService.request;
    this.form = this.createForm();

    this._contentService.onThemesChanged
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(themes => {
        this.themesList = themes;
        this.form.controls['theme'].updateValueAndValidity();
        this.setThemes();
      });

    this._contentService.getContent
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(request => {
        this.request = request;
        this.form = this.createForm();
        this.setThemes();
      });

    this.filteredThemes = this.form.controls['theme'].valueChanges.pipe(
      startWith(''),
      map((theme: string | null) => theme != null ? this._filter(theme): this.themesList.slice())
    );
  }

  createForm(): FormGroup {
    let form = this._formBuilder.group({
      name: [this.request.name || null],
      theme: [null],
    });
    return form;
  }

  setThemes() {
    if (this.request.themes == null || this.request.themes == '')
      return;

    this.themes = this.request.themes.split(",")
      .map(v => this.themesList
        .find(f => f.id == +v)
      );
  }

  find() {
    this.request.name = this.form.value.name;
    this.request.themes = this.themes.map(v => v.id).join(",");
    this.request.pn = 0;

    let tmp = new PagingList<TermContentModel>();
    tmp.items = [];
    tmp.totalCount = 0;

    this._contentService.onContentChanged.next(tmp);
    this._contentService.getContent.next(this.request);

    this.onFind.emit();
  }

  setSort(sort: string) {
    this.request.pn = 0;

    switch (sort) {
      case 'asc':
        this.request.sort = 'asc';
        break;
      case 'desc':
        this.request.sort = 'desc';
        break;
      default:
        this.request.sort = '';
        break;
    }

    this._contentService.getContent.next(this.request);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if (value != null && value.trim().length > 0) {
      let find = this.themesList.find(v => v.value.toLowerCase().indexOf(value.trim()) > 0);

      if (find != null)
        this.themes.push(find);
    }

    if (input) {
      input.value = '';
    }

    this.form.controls['theme'].setValue(null);
  }

  remove(theme: IdValueModel): void {
    const index = this.themes.indexOf(theme);

    if (index >= 0) {
      this.themes.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.themes.push(event.option.value);
    this.themeInput.nativeElement.value = '';
    this.form.controls['theme'].setValue("");
  }

  private _filter(value: string): IdValueModel[] {
    if (typeof (value) !== 'string' || value == "") return this.themesList.slice();

    const filterValue = value.toLowerCase();
    return this.themesList.filter(theme => theme.value.toLowerCase().indexOf(filterValue) === 0);
  }
}
