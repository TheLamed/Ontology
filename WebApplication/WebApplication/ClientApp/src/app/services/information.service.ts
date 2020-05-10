import { Injectable } from "@angular/core";
import { DialogService } from "./dialog.service";
import { InformationApiService } from "./api/api-information.service";
import { Subject, BehaviorSubject } from "rxjs";
import { BindingInfoModel } from "../../models/binding-info.model";

@Injectable()
export class InformationService {

  startProcessing: Subject<any>;
  getInfo: Subject<any>;

  onInfoChanged: BehaviorSubject<BindingInfoModel>;

  constructor(
    private _apiService: InformationApiService,
    private _dialogService: DialogService,
  ) {
    this.startProcessing = new Subject();
    this.getInfo = new Subject();

    this.onInfoChanged = new BehaviorSubject(new BindingInfoModel());

    this.getInfo.subscribe(request => this.GetInfo());
    this.startProcessing.subscribe(request => this.StartProcessing());
  }

  private async GetInfo(): Promise<void> {
    let response = await this._apiService.GetInfo();

    if (response.success) {
      this.onInfoChanged.next(response.model);
      return;
    }
  }

  private async StartProcessing(): Promise<void> {
    let response = await this._apiService.StartProcessing();

    if (response.success) {
      this._dialogService.showSnackBar('Обробка розпочата');
      return;
    }
  }
}
