import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { AnalysedTextModel } from "../../models/text-analysis/analysed-text.model";
import { TextAnalizationRequest } from "../../models/text-analysis/text-analization-request.model";
import { TextAnalysisApiService } from "./api/api-text-analysis.service";
import { DialogService } from "./dialog.service";

@Injectable()
export class TextAnalysisService {

  analyseText: Subject<TextAnalizationRequest>;
  onTextAnalysed: BehaviorSubject<AnalysedTextModel>;
  textAnalysedLoading: BehaviorSubject<boolean>;

  request: TextAnalizationRequest;

  constructor(
    private _apiService: TextAnalysisApiService,
    private _dialogService: DialogService,
  ) {
    this.analyseText = new Subject();
    this.onTextAnalysed = new BehaviorSubject(null);
    this.textAnalysedLoading = new BehaviorSubject(false);

    this.analyseText.subscribe(v => {
      this._analyseText(v);
      this.request = v;
    });
  }

  private async _analyseText(request: TextAnalizationRequest): Promise<void> {
    this.textAnalysedLoading.next(true);
    let response = await this._apiService.TextAnalysis(request);
    this.textAnalysedLoading.next(false);

    if (response.success) {
      this.onTextAnalysed.next(response.model);
      return;
    }
    else {
      this._dialogService.showSnackBar('Сталася помилка!');
    }
  }

}
