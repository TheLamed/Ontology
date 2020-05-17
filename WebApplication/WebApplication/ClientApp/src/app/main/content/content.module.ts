import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { FindComponent } from './find/find.component';
import { MatFormFieldModule, MatInputModule, MatIconModule, MatTableModule, MatDialogModule, MatButtonModule, MatMenuModule, MatAutocompleteModule, MatChipsModule, MatTabsModule, MatProgressSpinnerModule, MatSortModule, MatPaginatorModule, MatCheckboxModule, MatTooltipModule } from '@angular/material';
import { TermContentComponent } from './term-content/term-content.component';

const routes: Routes = [
  {
    path: 't/:id',

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
  ],
  providers: [

  ],
  entryComponents: [
    FindComponent,
    TermContentComponent,
  ]
})
export class ContentModule { }
