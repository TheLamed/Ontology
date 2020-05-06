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

@Injectable()
export class TermsApiService {

  headers: HttpHeaders;

  constructor(
    private _httpClient: HttpClient,
    private _authService: AuthService,
  ) {

    this._authService.onUserChanged.subscribe(user => {
      this.headers = new HttpHeaders()
        .set('Authorization', 'bearer ' + localStorage.getItem('token'));
    });

  }

  @API<ModelResponse<boolean>>()
  public async AddTerm(request: EditTermModel): Promise<ModelResponse<boolean>> {
    let response = new ModelResponse<boolean>();
    response.model = await this._httpClient.post<boolean>('api/term', request, { headers: this.headers }).toPromise();
    return response;
  }

  @API<ModelResponse<boolean>>()
  public async UpdateTerm(request: EditTermModel): Promise<ModelResponse<boolean>> {
    let response = new ModelResponse<boolean>();
    response.model = await this._httpClient.put<boolean>('api/term/' + request.id, request, { headers: this.headers }).toPromise();
    return response;
  }

  @API<ModelResponse<boolean>>()
  public async DeleteTerm(id: number): Promise<ModelResponse<boolean>> {
    let response = new ModelResponse<boolean>();
    response.model = await this._httpClient.delete<boolean>('api/term/' + id, { headers: this.headers }).toPromise();
    return response;
  }
  
  @API<ModelResponse<boolean>>()
  public async AddThemeToTerm(request: ThemeToTermModel): Promise<ModelResponse<boolean>> {
    let response = new ModelResponse<boolean>();
    response.model = await this._httpClient.get<boolean>('api/term/' + request.termId + '/' + request.themeId, { headers: this.headers }).toPromise();
    return response;
  }

  @API<ModelResponse<boolean>>()
  public async DeleteThemeFromTerm(request: ThemeToTermModel): Promise<ModelResponse<boolean>> {
    let response = new ModelResponse<boolean>();
    response.model = await this._httpClient.delete<boolean>('api/term/' + request.termId + '/' + request.themeId, { headers: this.headers }).toPromise();
    return response;
  }
  
  @API<ModelResponse<PagingList<TermModel>>>()
  public async GetTerms(request: PagingParamsModel): Promise<ModelResponse<PagingList<TermModel>>> {
    let params = new HttpParams()
      .set("pn", request.pn.toString())
      .set("ps", request.ps.toString())
      .set("sort", request.sort);

    let response = new ModelResponse<PagingList<TermModel>>();
    response.model = await this._httpClient.get<PagingList<TermModel>>('api/term', { headers: this.headers, params: params }).toPromise();
    return response;
  }

}
