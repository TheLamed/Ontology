import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { API } from "../../../decorators/api.decorator";
import { LoginRequest } from "../../../models/login/login-request.model";
import { ModelResponse } from "../../../models/model-response.model";
import { LoginResponse } from "../../../models/login/login-response.model";
import { AuthService } from "../auth.service";
import { ThemeModel } from "../../../models/themes/theme.model";
import { AddThemeModel } from "../../../models/themes/add-theme.model";

@Injectable()
export class ThemesApiService {

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

  @API<ModelResponse<ThemeModel[]>>()
  public async GetThemes(): Promise<ModelResponse<ThemeModel[]>> {
    let response = new ModelResponse<ThemeModel[]>();
    response.model = await this._httpClient.get<ThemeModel[]>('api/theme', { headers: this.headers }).toPromise();
    return response;
  }

  @API<ModelResponse<boolean>>()
  public async AddTheme(model: AddThemeModel): Promise<ModelResponse<boolean>> {
    let response = new ModelResponse<boolean>();
    response.model = await this._httpClient.post<boolean>('api/theme', model, { headers: this.headers }).toPromise();
    return response;
  }

  @API<ModelResponse<boolean>>()
  public async UpdateTheme(model: AddThemeModel): Promise<ModelResponse<boolean>> {
    let response = new ModelResponse<boolean>();
    response.model = await this._httpClient.put<boolean>('api/theme/' + model.id, model, { headers: this.headers }).toPromise();
    return response;
  }

  @API<ModelResponse<boolean>>()
  public async DeleteTheme(id: number): Promise<ModelResponse<boolean>> {
    let response = new ModelResponse<boolean>();
    response.model = await this._httpClient.delete<boolean>('api/theme/' + id, { headers: this.headers }).toPromise();
    return response;
  }

}
