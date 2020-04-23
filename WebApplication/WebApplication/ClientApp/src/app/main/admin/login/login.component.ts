import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import { Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UsabilitiesService } from "../../../services/usabilities.service";
import { DialogService } from "../../../services/dialog.service";
import { LoginRequest } from "../../../../models/login/login-request.model";

@Component({
  selector: 'admin-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {

  isWrongLogin: boolean = false;
  form: FormGroup;

  private _unsubscribe: Subject<any>;

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _usabilities: UsabilitiesService,
    private _dialog: DialogService,
  ) {
    this._unsubscribe = new Subject<any>();
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  ngOnInit() {
    this.form = this.createForm();

    this._authService.onLoginned
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(isLogined => {
        if (isLogined == null) return;

        if (isLogined) this._router.navigateByUrl('a');
        else {
          this.isWrongLogin = true;
          this._dialog.showSnackBar('Неправельни логін або пароль!');
        }
      });

  }

  createForm(): FormGroup {
    let form = this._formBuilder.group({
      login: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
    return form;
  }

  login() {
    if (!this.form.valid) {
      this._usabilities.touchForm(this.form);
      this._dialog.showSnackBar('Будьласка, перевірте форму!');
      return;
    }

    let request = new LoginRequest(this.form.value);
    this._authService.login.next(request);
  }

}
