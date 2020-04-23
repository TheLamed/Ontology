import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API } from "../../../decorators/api.decorator";
import { LoginRequest } from "../../../models/login/login-request.model";
import { ModelResponse } from "../../../models/model-response.model";
import { LoginResponse } from "../../../models/login/login-response.model";

@Injectable()
export class LoginApiService {

  constructor(
    private _httpClient: HttpClient,
  ) {

  }

  @API<ModelResponse<LoginResponse>>()
  public async Login(model: LoginRequest): Promise<ModelResponse<LoginResponse>> {
    let response = new ModelResponse<LoginResponse>();
    response.model = await this._httpClient.post<LoginResponse>('api/auth', model).toPromise();
    return response;
  }

}
