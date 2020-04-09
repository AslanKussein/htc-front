import {BrowserModule} from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
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
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CreateClaimComponent} from "./claims/create-claim/create-claim.component";
import {DragDropModule} from '@angular/cdk/drag-drop';
import {AuthGuard} from "./helpers/auth.guard";
import {LoginComponent} from "./login/login.component";
import {ErrorInterceptor} from "./helpers/error.interceptor";
import {JwtInterceptor} from "./helpers/jwt.interceptor";
import { ToastrModule } from 'ngx-toastr';
import {UploaderService} from "./services/uploader.service";
import {DicService} from "./services/dic.service";
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, 'assets/i18n/', '.json');
}
import { NgxMaskModule, IConfig } from 'ngx-mask'
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {ShowImageComponent} from "./claims/create-claim/show-image/show-image.component";

const routes: Routes = [
  {path: '', redirectTo: '/claims', pathMatch: 'full', canActivate: [AuthGuard]},
  {path: 'claims', component: ClaimsComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'board', component: BoardComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'objects', component: ObjectsComponent, canActivate: [AuthGuard]},
  {path: 'staffs', component: StaffsComponent, canActivate: [AuthGuard]},
  {path: 'news', component: NewsComponent, canActivate: [AuthGuard]},
  {path: 'analytics', component: AnalyticsComponent, canActivate: [AuthGuard]},
  {path: 'create-claim', component: CreateClaimComponent, canActivate: [AuthGuard]},
];
export let options: Partial<IConfig> | (() => Partial<IConfig>);

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    ClaimsComponent,
    ProfileComponent,
    ObjectsComponent,
    StaffsComponent,
    CreateClaimComponent,
    LoginComponent,
    ShowImageComponent,
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
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DragDropModule,
    ToastrModule.forRoot(),
    NgxMaskModule.forRoot(options),
    MDBBootstrapModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    UploaderService,
    DicService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    CreateClaimComponent,
    ShowImageComponent
  ],
  schemas: [ NO_ERRORS_SCHEMA ],

})
export class AppModule {
}
