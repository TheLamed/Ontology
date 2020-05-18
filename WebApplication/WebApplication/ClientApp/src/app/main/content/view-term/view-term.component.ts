import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { ContentService } from "../../../services/content.service";
import { takeUntil } from "rxjs/operators";
import { ViewTermsService } from "./view-term.service";
import { TermViewModel, TERM_VIEW_LOADING } from "../../../../models/content/term-view.model";
import { setCookie, getCookie } from "../../shared/shared.functions";
import { TermContentModel } from "../../../../models/content/term-content.model";
import { TermSimpleModel } from "../../../../models/content/term-simple.model";
import { trigger, transition, query, style, stagger, animate } from "@angular/animations";

@Component({
  selector: 'view-term',
  templateUrl: './view-term.component.html',
  styleUrls: ['./view-term.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter',
          [style({ opacity: 0 }), stagger('60ms', animate('600ms ease-out', style({ opacity: 1 })))],
          { optional: true }
        ),
      ])
    ])
  ],
})
export class ViewTermComponent implements OnInit {

  term: TermViewModel;
  randomTerms: TermContentModel[] = [];

  set isMosaic(value: boolean) {
    setCookie('isMosaic', value ? 'true' : 'false');
  }

  get isMosaic(): boolean {
    let ism = getCookie('isMosaic');

    if (ism == 'false')
      return false;
    else
      return true;
  }

  private _unsubscribe: Subject<any>;

  constructor(
    private _router: Router,
    private _contentService: ContentService,
    private _viewService: ViewTermsService,
  ) {
    this._unsubscribe = new Subject<any>();
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
    this._viewService.onViewTermChanged.next(TERM_VIEW_LOADING)
  }

  ngOnInit() {
    this._contentService.getRandomTerms.next(9);

    this._viewService.onViewTermChanged
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(response => {
        this.term = response;
      });

    this._contentService.onRandomTermsChanged
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(response => {
        this.randomTerms = response;
      });

  }

  getDescription(): string {
    return this.term.description;
  }

  onFind() {
    this._router.navigateByUrl('');
  }

  getTerm(value: TermSimpleModel): TermContentModel {
    let tmp = new TermContentModel();

    tmp.id = value.id;
    tmp.name = value.name;
    tmp.description = value.description;
    tmp.themes = [];

    return tmp;
  }

}
