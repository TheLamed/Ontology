import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { ThemesService } from "../../../services/themes.service";
import { trigger, state, animate, transition, style } from "@angular/animations";
import { ThemeModel } from "../../../../models/themes/theme.model";
import { takeUntil } from "rxjs/operators";
import { MatTableDataSource, MatDialog } from "@angular/material";
import { AddThemeDialogComponent } from "./add-theme-dialog/add-theme-dialog.component";
import { DialogService } from "../../../services/dialog.service";

@Component({
  selector: 'admin-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ThemesComponent implements OnInit, OnDestroy {

  dataSource: MatTableDataSource<ThemeModel>;
  expandedElement: ThemeModel | null;
  columnsToDisplay = ['more', 'id', 'name', 'countOfTerms', 'actions'];

  private _unsubscribe: Subject<any>;

  constructor(
    private _router: Router,
    private _themesService: ThemesService,
    private _dialogService: DialogService,
    public dialog: MatDialog
  ) {
    this._unsubscribe = new Subject<any>();

    this.dataSource = new MatTableDataSource<ThemeModel>([]);
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  ngOnInit() {
    this._themesService.getTheme.next();

    this._themesService.onThemesChanged
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(themes => {
        this.dataSource.data = themes;
      });
  }

  themeAdd() {
    let dialogRef = this.dialog.open(AddThemeDialogComponent, {
      panelClass: 'add-theme-dialog',
      data: { }
    });
  }

  themeEdit(item: ThemeModel) {
    let dialogRef = this.dialog.open(AddThemeDialogComponent, {
      panelClass: 'add-theme-dialog',
      data: {
        edit: item,
      }
    });
  }

  themeDelete(item: ThemeModel) {
    this._dialogService.showConfirmationDialog('Ви впевнені, що хочете видалити цю тему?', result => {
      if (result) {
        this._themesService.deleteTheme.next(item.id);
      }
    });

    //let dialogRef = this.dialog.open(AddThemeDialogComponent, {
    //  panelClass: 'add-theme-dialog',
    //  data: {
    //    edit: item,
    //  }
    //});
  }
}
