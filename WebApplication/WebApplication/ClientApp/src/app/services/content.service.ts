import { Injectable } from "@angular/core";
import { ContentApiService } from "./api/api-content.service";
import { DialogService } from "./dialog.service";
import { Subject, BehaviorSubject } from "rxjs";
import { TermContentModel } from "../../models/content/term-content.model";
import { GetContentRequest } from "../../models/content/get-content-request.model";
import { PagingList } from "../../models/paging-list.model";
import { IdValueModel } from "../../models/id-value.model";

@Injectable()
export class ContentService {

  getRandomTerms: Subject<number>;
  getContent: Subject<GetContentRequest>;
  getThemes: Subject<any>;

  onSearch: BehaviorSubject<boolean>;
  onRandomTermsChanged: BehaviorSubject<TermContentModel[]>;
  onThemesChanged: BehaviorSubject<IdValueModel[]>;
  onContentChanged: BehaviorSubject<PagingList<TermContentModel>>;

  request: GetContentRequest;

  constructor(
    private _apiService: ContentApiService,
    private _dialogService: DialogService,
  ) {
    this.getRandomTerms = new Subject();
    this.getContent = new Subject();
    this.getThemes = new Subject();

    this.onSearch = new BehaviorSubject(false);
    this.onRandomTermsChanged = new BehaviorSubject([]);
    this.onThemesChanged = new BehaviorSubject([]);
    this.onContentChanged = new BehaviorSubject(new PagingList<TermContentModel>());

    this.request = new GetContentRequest({
      name: null,
      themes: null,
      pn: 0,
      ps: 9,
      sort: "",
    });

    this.getRandomTerms.subscribe(request => this.GetRandomTerms(request));
    this.getThemes.subscribe(request => this.GetThemes());
    this.getContent.subscribe(request => {
      if (request != null)
        this.request = request;

      this.GetContent();
    });

    this.getThemes.next();
  }

  private async GetRandomTerms(request: number) {
    let response = await this._apiService.GetRandomTerms(request);
    if (response.success) {
      this.onRandomTermsChanged.next(response.model);
    }
  }

  private async GetContent() {
    let response = await this._apiService.GetContent(this.request);
    if (response.success) {
      this.onContentChanged.next(response.model);
      this.onSearch.next(true);
    }
  }
  
  private async GetThemes() {
    let response = await this._apiService.GetThemes();
    if (response.success) {
      this.onThemesChanged.next(response.model);
    }
  }

}
