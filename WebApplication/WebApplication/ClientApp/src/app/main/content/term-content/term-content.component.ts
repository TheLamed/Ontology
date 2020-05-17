import { Component, OnDestroy, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { ContentService } from "../../../services/content.service";
import { trigger, transition, style, animate } from "@angular/animations";
import { takeUntil } from "rxjs/operators";
import { TermContentModel } from "../../../../models/content/term-content.model";
import { UsabilitiesService } from "../../../services/usabilities.service";
import { IdValueModel } from "../../../../models/id-value.model";

@Component({
  selector: 'term-content',
  templateUrl: './term-content.component.html',
  styleUrls: ['./term-content.component.scss'],
})
export class TermContentComponent implements OnInit {

  @Input()
  term: TermContentModel;

  constructor(
    private _contentService: ContentService,
    private _usabilities: UsabilitiesService,
  ) {
  }

  ngOnInit() {

  }

  getThemes(list: IdValueModel[], count: number) {
    let output = list.slice(0, count);

    if (list.length > count) {
      output.pop();
      output.push({ id: null, value: '...' } as IdValueModel);
    }

    return output;
  }

}
