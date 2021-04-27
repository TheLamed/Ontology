import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatButtonModule, MatCheckboxModule, MatChipsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatPaginatorModule, MatProgressSpinnerModule, MatSortModule, MatTabsModule, MatTooltipModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MdePopoverModule } from '@material-extended/mde';
import { FindComponent } from './find/find.component';
import { MainPageComponent } from './main-page/main-page.component';
import { TermContentComponent } from './term-content/term-content.component';
import { TextAnalysationFormComponent } from './text-analysation-form/text-analysation-form.component';
import { TextAnalysationResultComponent } from './text-analysation-result/text-analysation-result.component';
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
    path: 'ta/form',
    component: TextAnalysationFormComponent,
  },
  {
    path: 'ta/result',
    component: TextAnalysationResultComponent,
  },
  {
    path: 'ta',
    redirectTo: 'ta/form'
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
    TextAnalysationFormComponent,
    TextAnalysationResultComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    //BrowserAnimationsModule,

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
    MatCheckboxModule,
    MatTabsModule,

    MdePopoverModule,
  ],
  providers: [
    ViewTermsService,
  ],
  entryComponents: [
    FindComponent,
    TermContentComponent,
    TextAnalysationFormComponent,
    TextAnalysationResultComponent,
  ]
})
export class ContentModule { }
