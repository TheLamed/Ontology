import { animate, state, style, transition, trigger } from "@angular/animations";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatTableDataSource, MatPaginator, MatSort, Sort, PageEvent } from "@angular/material";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { DialogService } from "../../../services/dialog.service";
import { ThemesService } from "../../../services/themes.service";
import { TermsService } from "../../../services/term.service";
import { TermModel } from "../../../../models/terms/term.model";
import { takeUntil } from "rxjs/operators";
import { PagingParamsModel } from "../../../../models/paging-params.model";
import { UsabilitiesService } from "../../../services/usabilities.service";
import { AddTermDialogComponent } from "./add-term-dialog/add-term-dialog.component";
import { ManageThemesDialogComponent } from "./manage-themes-dialog/manage-themes-dialog.component";

@Component({
  selector: 'admin-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TermsComponent implements OnInit, OnDestroy {

  dataSource: MatTableDataSource<TermModel>;
  expandedElement: TermModel | null;
  columnsToDisplay = ['more', 'id', 'name', 'actions'];
  totalCount: number = 0; 
  pagingParams: PagingParamsModel;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private _unsubscribe: Subject<any>;

  constructor(
    private _router: Router,
    private _themesService: ThemesService,
    private _termsService: TermsService,
    private _dialogService: DialogService,
    private _usabilities: UsabilitiesService,
    public dialog: MatDialog
  ) {
    this._unsubscribe = new Subject<any>();
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<TermModel>([]);
    this.pagingParams = new PagingParamsModel(this._termsService.getTermsRequest);

    this._termsService.onTermsChanged
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(response => {
        this.dataSource.data = response.items;
        this.totalCount = response.totalCount;
      });

    this.sort.sortChange.subscribe((s: Sort) => {
      this.pagingParams.sort = s.direction;
      this._termsService.getTerm.next(this.pagingParams);
    });

    this.paginator.page.subscribe((p: PageEvent) => {
      this.pagingParams.pn = p.pageIndex;
      this.pagingParams.ps = p.pageSize;
      this._termsService.getTerm.next(this.pagingParams);
    });

    this._termsService.getTerm.next(this.pagingParams);
  }

  getUrl(url: string) {
    return this._usabilities.extractHostname(url);
  }

  getUrls(text: string) {
    let urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, url => '<a class="url" href="' + url + '" target="_blank">' + this.getUrl(url) + '</a>')
  }

  deleteTerm(id: number) {
    this._dialogService.showConfirmationDialog('Ви впевнені, що хочете видалити цей термін?', result => {
      if (result) {
        this._termsService.deleteTerm.next(id);
      }
    });
  }

  addTerm() {
    let dialogRef = this.dialog.open(AddTermDialogComponent, {
      panelClass: 'add-term-dialog',
      data: {}
    });
  }

  editTerm(item: TermModel) {
    let dialogRef = this.dialog.open(AddTermDialogComponent, {
      panelClass: 'add-term-dialog',
      data: {
        edit: item
      }
    });
  }

  editThemes(item: TermModel) {
    let dialogRef = this.dialog.open(ManageThemesDialogComponent, {
      panelClass: 'add-term-dialog',
      data: {
        term: item
      }
    });
  }

}
