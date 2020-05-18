import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatButtonModule, MatChipsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatPaginatorModule, MatProgressSpinnerModule, MatSortModule, MatTooltipModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { MdePopoverModule } from '@material-extended/mde';
import { FindComponent } from './find/find.component';
import { MainPageComponent } from './main-page/main-page.component';
import { TermContentComponent } from './term-content/term-content.component';
import { ViewTermComponent } from './view-term/view-term.component';
import { ViewTermsService } from './view-term/view-term.service';

const routes: Routes = [
  {
    path: 't/:id',
    component: ViewTermComponent,
    resolve: {
      viewTerm: ViewTermsService,
    }
  },
  {
    path: '**',
    component: MainPageComponent,
  },
];

@NgModule({
  declarations: [
    MainPageComponent,
    FindComponent,
    TermContentComponent,
    ViewTermComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(routes),

    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatMenuModule,
    MatProgressSpinnerModule,

    MdePopoverModule,
  ],
  providers: [
    ViewTermsService,
  ],
  entryComponents: [
    FindComponent,
    TermContentComponent,
  ]
})
export class ContentModule { }
