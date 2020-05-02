import { Injectable } from "@angular/core";
import { LoginApiService } from "./api/api-login.service";
import { Subject, BehaviorSubject } from "rxjs";
import { LoginRequest } from "../../models/login/login-request.model";
import { UserModel } from "../../models/user.model";
import { Router } from "@angular/router";

@Injectable()
export class AuthService {

  public login: Subject<LoginRequest>;
  public logout: Subject<any>;

  public onUserChanged: BehaviorSubject<UserModel>;
  public onLoginned: BehaviorSubject<boolean>;

  constructor(
    private _api: LoginApiService,
    private _router: Router,
  ) {
    this.login = new Subject<LoginRequest>();
    this.logout = new Subject<any>();

    this.onUserChanged = new BehaviorSubject<UserModel>(new UserModel());
    this.onLoginned = new BehaviorSubject<boolean>(null);

    this.onUserChanged.subscribe(v => console.log(v))

    this.login.subscribe(request => this.loginning(request));
    this.logout.subscribe(request => this.logouting());
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

  private logouting() {
    localStorage.removeItem('token');
    this._router.navigateByUrl('a');
  }

}
