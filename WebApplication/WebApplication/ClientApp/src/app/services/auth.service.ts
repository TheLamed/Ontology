import { Injectable } from "@angular/core";
import { LoginApiService } from "./api/api-login.service";
import { Subject, BehaviorSubject } from "rxjs";
import { LoginRequest } from "../../models/login/login-request.model";
import { UserModel } from "../../models/user.model";

@Injectable()
export class AuthService {

  public login: Subject<LoginRequest>;

  public onUserChanged: BehaviorSubject<UserModel>;
  public onLoginned: BehaviorSubject<boolean>;

  constructor(
    private _api: LoginApiService,
  ) {
    this.login = new Subject<LoginRequest>();

    this.onUserChanged = new BehaviorSubject<UserModel>(new UserModel());
    this.onLoginned = new BehaviorSubject<boolean>(null);

    this.onUserChanged.subscribe(v => console.log(v))

    this.login.subscribe(request => this.loginning(request));
  }

  private async loginning(request: LoginRequest): Promise<void> {

    let response = await this._api.Login(request);

    if (response.success) {
      this.onLoginned.next(true);
      this.onUserChanged.next(response.model.user);

      localStorage.setItem('token', response.model.token);

      return;
    }

    if (response.status == 404) {
      this.onLoginned.next(false);
      return;
    }

  }

}
