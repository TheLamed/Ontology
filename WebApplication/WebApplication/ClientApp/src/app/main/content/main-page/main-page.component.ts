import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { ContentService } from "../../../services/content.service";
import { trigger, transition, style, animate, query, stagger } from "@angular/animations";
import { takeUntil } from "rxjs/operators";
import { TermContentModel } from "../../../../models/content/term-content.model";
import { GetContentRequest } from "../../../../models/content/get-content-request.model";
import { PageEvent } from "@angular/material";
import { setCookie, getCookie } from "../../shared/shared.functions";

@Component({
  selector: 'main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
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
export class MainPageComponent implements OnInit, OnDestroy {

  isSearch: boolean;

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

  randomTerms: TermContentModel[] = [];
  searchTerms: TermContentModel[] = [];
  totalCount: number = 0;

  request: GetContentRequest;

  private _unsubscribe: Subject<any>;

  constructor (
    private _router: Router,
    private _contentService: ContentService,
  ) {
    this._unsubscribe = new Subject<any>();
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  ngOnInit() {

    this.request = this._contentService.request;

    this._contentService.getRandomTerms.next(9);

    this._contentService.onSearch
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(isSearch => this.isSearch = isSearch);

    this._contentService.onRandomTermsChanged
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(response => {
        this.randomTerms = response;
      });

    this._contentService.onContentChanged
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(response => {
        this.searchTerms = response.items;
        this.totalCount = response.totalCount;
      });

    this._contentService.getContent
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(request => {
        this.request = request;
      });
  }

  reloadRandomTerms() {
    this.randomTerms = [];
    this._contentService.getRandomTerms.next(9);
  }

  paginatorChange(event: PageEvent) {
    this.request.pn = event.pageIndex;
    this.request.ps = event.pageSize;

    this._contentService.getContent.next(this.request);
  }

}
