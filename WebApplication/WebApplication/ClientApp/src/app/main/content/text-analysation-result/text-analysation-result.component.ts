import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TermContentModel } from '../../../../models/content/term-content.model';
import { TermSimpleModel } from '../../../../models/content/term-simple.model';
import { AnalysedSentenceModel } from '../../../../models/text-analysis/analysed-senetence.model';
import { AnalysedTextModel } from '../../../../models/text-analysis/analysed-text.model';
import { TextAnalizationRequest } from '../../../../models/text-analysis/text-analization-request.model';
import { DialogService } from '../../../services/dialog.service';
import { TextAnalysisService } from '../../../services/text-analysis.service';
import { UsabilitiesService } from '../../../services/usabilities.service';
import { getCookie, setCookie } from '../../shared/shared.functions';

@Component({
  selector: 'text-analysation-result',
  templateUrl: './text-analysation-result.component.html',
  styleUrls: ['./text-analysation-result.component.scss'],
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
export class TextAnalysationResultComponent {

  isLoading: boolean = false;
  analysedText: AnalysedTextModel;
  request: TextAnalizationRequest;

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
    private _taService: TextAnalysisService,
    private _dialog: DialogService,
    private _usabilities: UsabilitiesService,
    private _rouer: Router,
  ) {
    this._unsubscribe = new Subject<any>();
  }

  ngOnInit() {
    this.request = this._taService.request;

    this._taService.textAnalysedLoading
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(v => this.isLoading = v);

    this._taService.onTextAnalysed
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(v => {
        this.analysedText = v;
      });
    
    this._taService.analyseText
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(v => {
        this.request = v;
      });


    if (this.isLoading === false && this.analysedText == null)
      this._rouer.navigateByUrl('/');
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  getDescription(str: string) {

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
      .map(v => this.analysedText.terms.find(f => f.id == v));
  }

  getTermValue(term: string) {
    let arr = term.split('<ids>');
    return arr[1];
  }

  isTerm(value: string) {
    return value.indexOf('<term>') == 0;
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

  getSentences(): AnalysedSentenceModel[] {
    return this.analysedText.paragraphs.map(v => v.sentences).reduce((a, b) => a.concat(b));
  }
}
