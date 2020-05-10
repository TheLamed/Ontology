import { OnInit, OnDestroy, Component } from "@angular/core";
import { Subject } from "rxjs";
import { InformationService } from "../../../services/information.service";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'admin-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss'],
})
export class InformationComponent implements OnInit, OnDestroy {

  inProgress: boolean = false;
  totalCount: number = 0;
  unindexedCount: number = 0;
  percent: number = 0;

  private intervalId;
  private _unsubscribe: Subject<any>;

  constructor(
    private _informationService: InformationService,
  ) {
    this._unsubscribe = new Subject<any>();

    this.intervalId = setInterval(() => this._informationService.getInfo.next(), 1000);

    this._informationService.onInfoChanged
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(response => {
        this.inProgress = response.inProgress;
        this.totalCount = response.totalCount;
        this.unindexedCount = response.unindexedCount;
        this.percent = response.percent;
      });
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
    clearInterval(this.intervalId);
  }

  ngOnInit() {

  }

  startProcessing() {
    this._informationService.startProcessing.next();
  }
}
