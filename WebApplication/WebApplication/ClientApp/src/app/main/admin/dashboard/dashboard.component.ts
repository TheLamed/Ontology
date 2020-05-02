import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {

  private _unsubscribe: Subject<any>;

  constructor(
    private _router: Router,
    private _authService: AuthService,
  ) {
    this._unsubscribe = new Subject<any>();
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  ngOnInit() {
    
  }

  logout() {
    this._authService.logout.next();
  }
}
