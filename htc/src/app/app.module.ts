import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { ClaimsComponent } from './claims/claims.component';
import {RouterModule, Routes} from "@angular/router";
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { ProfileComponent } from './profile/profile.component';
import { ObjectsComponent } from './objects/objects.component';
import { PanelComponent } from './panel/panel.component';
import {StaffsComponent} from "./staffs/staffs.component";
import {NewsComponent} from "./news/news.component";
import {AnalyticsComponent} from "./analytics/analytics.component";
import {ModalModule, PaginationModule} from 'ngx-bootstrap';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import {FormsModule} from "@angular/forms";
import {CreateClaimComponent} from "./claims/create-claim/create-claim.component";


export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, 'assets/i18n/', '.json');
}

const routes: Routes = [
  {path: '', redirectTo: '/claims', pathMatch: 'full'},
  {path: 'claims', component: ClaimsComponent},
  {path: 'board', component: BoardComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'objects', component: ObjectsComponent},
  {path: 'panel', component: PanelComponent},
  {path: 'staffs', component: StaffsComponent},
  {path: 'news', component: NewsComponent},
  {path: 'analytics', component: AnalyticsComponent},
  {path: 'create-claim', component: CreateClaimComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    ClaimsComponent,
    ProfileComponent,
    ObjectsComponent,
    PanelComponent,
    StaffsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes, {useHash: true}),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    HttpClientModule,
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgSelectModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
