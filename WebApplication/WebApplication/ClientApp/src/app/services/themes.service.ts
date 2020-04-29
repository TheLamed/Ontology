import { Injectable } from "@angular/core";
import { ThemesApiService } from "./api/api-themes.service";
import { DialogService } from "./dialog.service";
import { Subject, BehaviorSubject } from "rxjs";
import { AddThemeModel } from "../../models/themes/add-theme.model";
import { ModelResponse } from "../../models/model-response.model";
import { ThemeModel } from "../../models/themes/theme.model";

@Injectable()
export class ThemesService {

  addTheme = new Subject<AddThemeModel>();
  updateTheme = new Subject<AddThemeModel>();
  deleteTheme = new Subject<number>();
  getTheme = new Subject<any>();

  onThemesChanged = new BehaviorSubject<ThemeModel[]>([]);

  constructor(
    private _apiService: ThemesApiService,
    private _dialogService: DialogService,
  ) {

    this.addTheme.subscribe(request => this.addThemes(request));
    this.deleteTheme.subscribe(request => this.deleteThemes(request));
    this.updateTheme.subscribe(request => this.updateThemes(request));
    this.getTheme.subscribe(request => this.getThemes());

  }

  private async getThemes(): Promise<void> {
    let response = await this._apiService.GetThemes();

    if (response.success) {
      this.onThemesChanged.next(response.model);
      return;
    }
  }

  private async addThemes(request: AddThemeModel): Promise<void> {
    let response = await this._apiService.AddTheme(request);

    if (response.success && response.model === true) {
        this.getTheme.next();
        this._dialogService.showSnackBar('Додано');
        return;
    }
    else {
      this._dialogService.showSnackBar('Не додано');
    }
  }

  private async deleteThemes(request: number): Promise<void> {
    let response = await this._apiService.DeleteTheme(request);

    if (response.success && response.model === true) {
      this.getTheme.next();
      this._dialogService.showSnackBar('Видалено');
      return;
    }
    else {
      this._dialogService.showSnackBar('Не видалено');
    }
  }

  private async updateThemes(request: AddThemeModel): Promise<void> {
    let response = await this._apiService.UpdateTheme(request);

    if (response.success && response.model === true) {
      this.getTheme.next();
      this._dialogService.showSnackBar('Обновлено');
      return;
    }
    else {
      this._dialogService.showSnackBar('Не обновлено');
    }
  }


}
