import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { TextAnalizationRequest } from '../../../../models/text-analysis/text-analization-request.model';
import { DialogService } from '../../../services/dialog.service';
import { TextAnalysisService } from '../../../services/text-analysis.service';

@Component({
  selector: 'text-analysation-form',
  templateUrl: './text-analysation-form.component.html',
  styleUrls: ['./text-analysation-form.component.scss'],
})
export class TextAnalysationFormComponent {

  form: FormGroup;

  private _unsubscribe: Subject<any>;

  constructor(
    private _builder: FormBuilder,
    private _taService: TextAnalysisService,
    private _dialog: DialogService,
    private _router: Router,
  ) {
    this._unsubscribe = new Subject<any>();
  }

  ngOnInit() {
    this.form = this.createForm();
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  createForm(): FormGroup {
    let form = this._builder.group({
      text: ['', [Validators.required]],
      includeTermsShowing: [false, []],
      includeParagraphAnalization: [false, []],
      includeSentenceAnalization: [false, []],
    });
    return form;
  }

  touchForm(form: FormGroup) {
    (<any>Object).values(form.controls).forEach(control => {
      if (control.controls) this.touchForm(control);
      else control.markAsTouched();
    });
  }

  sendForm() {
    if (!this.form.valid) {
      this._dialog.showSnackBar("Перевірте форму!");
      this.touchForm(this.form);
      return;
    }

    let request = new TextAnalizationRequest();
    request.text = this.form.value.text;
    request.includeTermsShowing = this.form.value.includeTermsShowing;
    request.includeParagraphAnalization = this.form.value.includeParagraphAnalization;
    request.includeSentenceAnalization = this.form.value.includeSentenceAnalization;

    this._taService.analyseText.next(request);
    this._router.navigateByUrl('/ta/result');
  }
}
