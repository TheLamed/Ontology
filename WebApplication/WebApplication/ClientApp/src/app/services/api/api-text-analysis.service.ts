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
import { TextAnalizationRequest } from "../../../models/text-analysis/text-analization-request.model";
import { AnalysedTextModel } from "../../../models/text-analysis/analysed-text.model";

@Injectable()
export class TextAnalysisApiService {

  headers: HttpHeaders;

  constructor(
    private _httpClient: HttpClient,
  ) {

  }

  @API<ModelResponse<AnalysedTextModel>>()
  public async TextAnalysis(request: TextAnalizationRequest): Promise<ModelResponse<AnalysedTextModel>> {
    let response = new ModelResponse<AnalysedTextModel>();
    response.model = await this._httpClient.post<AnalysedTextModel>('api/text-analysis', request).toPromise();
    return response;
  }

}
