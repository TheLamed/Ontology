import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthoriseGuard implements CanActivate {

  constructor(
    private _auth: AuthService,
    private _router: Router,
  ) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (localStorage.getItem('token') == null) {
      return true;
    }

    this._router.navigateByUrl('a/dashboard');
    return false;
  }
}
