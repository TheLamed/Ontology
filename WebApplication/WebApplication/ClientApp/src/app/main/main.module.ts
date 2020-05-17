import { Route } from "@angular/compiler/src/core";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatSnackBarModule, MatDialogModule, MatProgressSpinnerModule, MatPaginatorIntl } from "@angular/material";
import { UsabilitiesService } from "../services/usabilities.service";
import { DialogService } from "../services/dialog.service";
import { LoginApiService } from "../services/api/api-login.service";
import { AuthService } from "../services/auth.service";
import { ThemesApiService } from "../services/api/api-themes.service";
import { ThemesService } from "../services/themes.service";
import { ConfirmDialogModule } from "./shared/dialogs/confirm-dialog/confirm-dialog.module";
import { TermsApiService } from "../services/api/api-terms.service";
import { TermsService } from "../services/term.service";
import { InformationApiService } from "../services/api/api-information.service";
import { InformationService } from "../services/information.service";
import { ContentApiService } from "../services/api/api-content.service";
import { ContentService } from "../services/content.service";

//#region Paginator

const ukrainianRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) { return `0 з ${length}`; }

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  const endIndex = startIndex < length ?
    Math.min(startIndex + pageSize, length) :
    startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} з ${length}`;
}


export function getUkrainianPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Кількість:';
  paginatorIntl.nextPageLabel = 'Наступна сторінка';
  paginatorIntl.previousPageLabel = 'Попередня сторінка';
  paginatorIntl.getRangeLabel = ukrainianRangeLabel;

  return paginatorIntl;
}

//#endregion

const routes: Routes = [
  {
    path: '',
    loadChildren: './content/content.module#ContentModule',
  },
  {
    path: 'a',
    loadChildren: './admin/admin.module#AdminModule',
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,

    ConfirmDialogModule,

    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  providers: [
    UsabilitiesService,
    DialogService,

    LoginApiService,
    ThemesApiService,
    TermsApiService,
    InformationApiService,
    ContentApiService,

    AuthService,
    ThemesService,
    TermsService,
    InformationService,
    ContentService,

    { provide: MatPaginatorIntl, useValue: getUkrainianPaginatorIntl() }
  ],
})
export class MainModule { }

