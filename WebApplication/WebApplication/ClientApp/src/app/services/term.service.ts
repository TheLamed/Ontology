import { Injectable } from "@angular/core";
import { ThemesApiService } from "./api/api-themes.service";
import { DialogService } from "./dialog.service";
import { Subject, BehaviorSubject } from "rxjs";
import { AddThemeModel } from "../../models/themes/add-theme.model";
import { ModelResponse } from "../../models/model-response.model";
import { ThemeModel } from "../../models/themes/theme.model";
import { EditTermModel } from "../../models/terms/edit-term.model";
import { PagingList } from "../../models/paging-list.model";
import { TermModel } from "../../models/terms/term.model";
import { TermsApiService } from "./api/api-terms.service";
import { ThemeToTermModel } from "../../models/terms/theme-to-term.model";
import { PagingParamsModel } from "../../models/paging-params.model";

@Injectable()
export class TermsService {

  addTerm = new Subject<EditTermModel>();
  updateTerm = new Subject<EditTermModel>();
  assignThemeToTerm = new Subject<ThemeToTermModel>();
  removeThemeFromTerm = new Subject<ThemeToTermModel>();
  deleteTerm = new Subject<number>();
  getTerm = new Subject<PagingParamsModel>();

  onTermsChanged = new BehaviorSubject<PagingList<TermModel>>(new PagingList<TermModel>());

  getTermsRequest: PagingParamsModel;

  constructor(
    private _apiService: TermsApiService,
    private _dialogService: DialogService,
  ) {

    this.addTerm.subscribe(request => this.addTerms(request));
    this.deleteTerm.subscribe(request => this.deleteTerms(request));
    this.updateTerm.subscribe(request => this.updateTerms(request));
    this.assignThemeToTerm.subscribe(request => this.assignThemesToTerm(request));
    this.removeThemeFromTerm.subscribe(request => this.removeThemesFromTerm(request));
    this.getTerm.subscribe(request => {
      if (request != null)
        this.getTermsRequest = request;

      this.getTerms(this.getTermsRequest);
    });

    this.getTermsRequest = new PagingParamsModel({
      pn: 0,
      ps: 10,
      sort: "asc",
    });
  }

  private async getTerms(request: PagingParamsModel): Promise<void> {
    let response = await this._apiService.GetTerms(request);

    if (response.success) {
      this.onTermsChanged.next(response.model);
      return;
    }
  }

  private async addTerms(request: EditTermModel): Promise<void> {
    let response = await this._apiService.AddTerm(request);

    if (response.success && response.model === true) {
      this.getTerm.next();
      this._dialogService.showSnackBar('Додано');
      return;
    }
    else {
      this._dialogService.showSnackBar('Не додано');
    }
  }

  private async deleteTerms(request: number): Promise<void> {
    let response = await this._apiService.DeleteTerm(request);

    if (response.success && response.model === true) {
      this.getTerm.next();
      this._dialogService.showSnackBar('Видалено');
      return;
    }
    else {
      this._dialogService.showSnackBar('Не видалено');
    }
  }

  private async updateTerms(request: EditTermModel): Promise<void> {
    let response = await this._apiService.UpdateTerm(request);

    if (response.success && response.model === true) {
      this.getTerm.next();
      this._dialogService.showSnackBar('Обновлено');
      return;
    }
    else {
      this._dialogService.showSnackBar('Не обновлено');
    }
  }

  private async assignThemesToTerm(request: ThemeToTermModel): Promise<void> {
    let response = await this._apiService.AddThemeToTerm(request);

    if (response.success && response.model === true) {
      this.getTerm.next();
      this._dialogService.showSnackBar('Додано');
      return;
    }
    else {
      this._dialogService.showSnackBar('Не додано');
    }
  }

  private async removeThemesFromTerm(request: ThemeToTermModel): Promise<void> {
    let response = await this._apiService.DeleteThemeFromTerm(request);

    if (response.success && response.model === true) {
      this.getTerm.next();
      this._dialogService.showSnackBar('Видалено');
      return;
    }
    else {
      this._dialogService.showSnackBar('Не видалено');
    }
  }


}
