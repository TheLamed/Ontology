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
import { SafeHtml, DomSanitizer } from "@angular/platform-browser";
import { UsabilitiesService } from "../../../services/usabilities.service";

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

  currentPopoverTerms: TermSimpleModel[] = [];

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

  startTermRegexp = /<term id="(\d+(?:,[ ]?\d+)*)">([^<>]+)<\/term>/gim;

  private _unsubscribe: Subject<any>;

  constructor(
    private _router: Router,
    private _contentService: ContentService,
    private _viewService: ViewTermsService,
    private _usabilities: UsabilitiesService,
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

  getDescription() {
    let str = this.term.description;

    str = str.replace(this.startTermRegexp, (value: string, ids: string, term: string) => {
      return "<splt><term>" + ids + "<ids>" + term + "<splt>";
    });

    let output = str.split('<splt>');

    return output;
  }

  setCurrentPopoverTerms(term: string) {
    term = term.replace('<term>', "");

    let arr = term.split('<ids>');

    this.currentPopoverTerms = arr[0]
      .split(',')
      .map(v => +v)
      .filter((v, i, objs) => objs.indexOf(v) === i)
      .map(v => this.term.relatedTerms.find(f => f.id == v));
  }

  getTermValue(term: string) {
    let arr = term.split('<ids>');
    return arr[1];
  }

  isTerm(value: string) {
    return value.indexOf('<term>') == 0;
  }

  onFind() {
    this._router.navigateByUrl('/');
  }

  getTerm(value: TermSimpleModel): TermContentModel {
    let tmp = new TermContentModel();

    tmp.id = value.id;
    tmp.name = value.name;
    tmp.description = value.description;
    tmp.themes = [];

    return tmp;
  }

  getUrl(url: string) {
    return this._usabilities.extractHostname(url);
  }

  getUrls(text: string) {
    let urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, url => '<a class="url" href="' + url + '" target="_blank">' + this.getUrl(url) + '</a>')
  }

}
