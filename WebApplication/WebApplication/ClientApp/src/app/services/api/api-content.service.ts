import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "../auth.service";
import { API } from "../../../decorators/api.decorator";
import { ModelResponse } from "../../../models/model-response.model";
import { EditTermModel } from "../../../models/terms/edit-term.model";
import { ThemeToTermModel } from "../../../models/terms/theme-to-term.model";
import { PagingList } from "../../../models/paging-list.model";
import { TermModel } from "../../../models/terms/term.model";
import { PagingParamsModel } from "../../../models/paging-params.model";
import { IdRequest } from "../../../models/id-request.model";
import { TermViewModel } from "../../../models/content/term-view.model";
import { GetContentRequest } from "../../../models/content/get-content-request.model";
import { TermContentModel } from "../../../models/content/term-content.model";
import { IdValueModel } from "../../../models/id-value.model";

@Injectable()
export class ContentApiService {

  constructor(
    private _httpClient: HttpClient,
  ) {
  }

  @API<ModelResponse<TermViewModel>>()
  public async ViewTerm(request: IdRequest): Promise<ModelResponse<TermViewModel>> {
    let response = new ModelResponse<TermViewModel>();
    response.model = await this._httpClient.get<TermViewModel>('api/content/' + request.id).toPromise();
    return response;
  }

  @API<ModelResponse<PagingList<TermContentModel>>>()
  public async GetContent(request: GetContentRequest): Promise<ModelResponse<PagingList<TermContentModel>>> {
    let params = new HttpParams()
      .set("pn", request.pn.toString())
      .set("ps", request.ps.toString());

    if (request.sort != null && request.sort != '')
      params = params.set("sort", request.sort)

    if (request.name != null && request.name != '')
      params = params.set("name", request.name);

    if (request.themes != null && request.themes != '')
      params = params.set("themes", request.themes);

    let response = new ModelResponse<PagingList<TermContentModel>>();
    response.model = await this._httpClient.get<PagingList<TermContentModel>>('api/content/find', { params: params }).toPromise();
    return response;
  }

  @API<ModelResponse<TermContentModel[]>>()
  public async GetRandomTerms(count: number): Promise<ModelResponse<TermContentModel[]>> {
    let params = new HttpParams()
      .set("count", count.toString());

    let response = new ModelResponse<TermContentModel[]>();
    response.model = await this._httpClient.get<TermContentModel[]>('api/content/random', { params: params }).toPromise();
    return response;
  }

  @API<ModelResponse<IdValueModel[]>>()
  public async GetThemes(): Promise<ModelResponse<IdValueModel[]>> {
    let response = new ModelResponse<IdValueModel[]>();
    response.model = await this._httpClient.get<IdValueModel[]>('api/content/themes').toPromise();
    return response;
  }

}
