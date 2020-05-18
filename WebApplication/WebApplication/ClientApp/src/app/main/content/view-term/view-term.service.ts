import { Injectable } from "@angular/core";
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable, BehaviorSubject } from "rxjs";
import { ContentService } from "../../../services/content.service";
import { TermViewModel, TERM_VIEW_LOADING } from "../../../../models/content/term-view.model";
import { IdRequest } from "../../../../models/id-request.model";

@Injectable()
export class ViewTermsService implements Resolve<any> {

  onViewTermChanged: BehaviorSubject<TermViewModel>;

  routeParams: any;

  _isSubscribed: boolean = false;

  constructor(
    private _router: Router,
    private _contentService: ContentService,
  ) {
    this.onViewTermChanged = new BehaviorSubject(null);
  }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    this.routeParams = route.params;

    this.onViewTermChanged.next(TERM_VIEW_LOADING);

    return new Promise((resolve, reject) => {
      Promise.all([
        this.loadTerm(),
      ]).then(
        ([files]) => {

          if (!this._isSubscribed) {

            this._contentService.onViewTermChanged.subscribe(response => {
              this.onViewTermChanged.next(response);
            });

            this._isSubscribed = true;
          }

          this._contentService.getRandomTerms.next(9);

          resolve();
        },
        reject
      );
    });
  }

  private async loadTerm() {
    if (this.routeParams['id'] == null)
      return;

    let id = this.routeParams['id'];

    let request = new IdRequest({ id: +id });

    this._contentService.viewTerm.next(request);
  }

}
