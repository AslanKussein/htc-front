import {BrowserModule} from '@angular/platform-browser';
import {NgModule, APP_INITIALIZER} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BoardComponent} from './board/board.component';
import {ClaimsComponent} from './claims/claims.component';
import {RouterModule, Routes} from "@angular/router";
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import {ProfileComponent} from './profile/profile.component';
import {ObjectsComponent} from './objects/objects.component';
import {StaffsComponent} from "./staffs/staffs.component";
import {NewsComponent} from "./news/news.component";
import {AnalyticsComponent} from "./analytics/analytics.component";
import {ModalModule, PaginationModule} from 'ngx-bootstrap';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from "@angular/forms";
import {CreateClaimComponent} from "./claims/create-claim/create-claim.component";
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ClaimService} from "./services/claim.service";
import {NotifierModule, NotifierOptions} from 'angular-notifier';
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, 'assets/i18n/', '.json');
}

const routes: Routes = [
  {path: '', redirectTo: '/claims', pathMatch: 'full'},
  {path: 'claims', component: ClaimsComponent},
  {path: 'board', component: BoardComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'objects', component: ObjectsComponent},
  {path: 'staffs', component: StaffsComponent},
  {path: 'news', component: NewsComponent},
  {path: 'analytics', component: AnalyticsComponent},
  {path: 'create-claim', component: CreateClaimComponent},
];

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12
    },
    vertical: {
      position: 'top',
      distance: 12,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    ClaimsComponent,
    ProfileComponent,
    ObjectsComponent,
    StaffsComponent,
    CreateClaimComponent,
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
    BrowserAnimationsModule,
    DragDropModule,
    NotifierModule.withConfig(customNotifierOptions)
  ],
  providers: [
    ClaimService,
    // KeycloakService,
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: kcFactory,
    //   // deps: [KeycloakService],
    //   multi: true
    // }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    CreateClaimComponent
  ],

})
export class AppModule {
}
