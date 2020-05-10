import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { API } from "../../../decorators/api.decorator";
import { LoginRequest } from "../../../models/login/login-request.model";
import { ModelResponse } from "../../../models/model-response.model";
import { LoginResponse } from "../../../models/login/login-response.model";
import { AuthService } from "../auth.service";
import { BindingInfoModel } from "../../../models/binding-info.model";

@Injectable()
export class InformationApiService {

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
  public async StartProcessing(): Promise<ModelResponse<boolean>> {
    let response = new ModelResponse<boolean>();
    response.model = await this._httpClient.get<boolean>('api/binding', { headers: this.headers }).toPromise();
    return response;
  }

  @API<ModelResponse<BindingInfoModel>>()
  public async GetInfo(): Promise<ModelResponse<BindingInfoModel>> {
    let response = new ModelResponse<BindingInfoModel>();
    response.model = await this._httpClient.get<BindingInfoModel>('api/binding/info', { headers: this.headers }).toPromise();
    return response;
  }

}
