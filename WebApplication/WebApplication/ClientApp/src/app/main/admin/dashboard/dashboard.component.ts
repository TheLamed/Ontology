import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {

  private _unsubscribe: Subject<any>;

  constructor(
    private _router: Router,
  ) {
    this._unsubscribe = new Subject<any>();
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  ngOnInit() {
    
  }
}
