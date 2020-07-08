import {BrowserModule} from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BoardComponent} from './components/board/board.component';
import {ClaimsComponent} from './components/claims/claims.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import {ProfileComponent} from './components/profile/profile.component';
import {ObjectsComponent} from './components/objects/objects.component';
import {StaffsComponent} from "./components/staffs/staffs.component";
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CreateClaimComponent} from "./components/claims/create-claim/create-claim.component";
import {DragDropModule} from '@angular/cdk/drag-drop';
import {LoginComponent} from "./components/login/login.component";
import {ErrorInterceptor} from "./helpers/error.interceptor";
import {JwtInterceptor} from "./helpers/jwt.interceptor";
import {ToastrModule} from 'ngx-toastr';
import {UploaderService} from "./services/uploader.service";
import {ChartsModule} from 'ng2-charts';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import localeRu from '@angular/common/locales/ru';
import localeKz from '@angular/common/locales/ru-KZ';
import {NgxMaskModule, IConfig} from 'ngx-mask'
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {ExitDeactivate} from "./helpers/canDeactivate/exitDeactivate";
import {UserService} from "./services/user.service";
import {NotificationService} from "./services/notification.service";
import {ModalComponent} from "./components/claims/create-claim/modal.window/modal.component";
import {DicControlComponent} from './components/dic-control/dic-control.component';
import {MyObjectsComponent} from './components/profile/my-objects/my-objects.component';
import {MyClaimsComponent} from './components/profile/my-claims/my-claims.component';
import {HomeComponent} from './components/home/home.component';
import {CreateClaimBtnComponent} from "./helpers/create-claim-btn/create-claim-btn.component";
import {ChartsComponent} from "./components/home/charts/charts.component";
import {CalendarComponent} from './components/home/calendar/calendar.component';
import {registerLocaleData} from "@angular/common";
import {MyClientsComponent} from "./components/profile/my-clients/my-clients.component";
import {ClientCardComponent} from './components/profile/my-clients/client-card/client-card.component';
import {YandexMapComponent} from './components/claims/create-claim/yandex-map/yandex-map.component';
import {NavComponent} from "./helpers/nav/nav.component";
import {FooterComponent} from "./helpers/footer/footer.component";
import {NgxUiLoaderConfig, NgxUiLoaderModule, PB_DIRECTION, POSITION, SPINNER} from 'ngx-ui-loader';
import {LoginModalComponent} from './components/login/login-modal/login-modal.component';
import {CloseDealComponent} from "./components/board/close-deal/close-deal.component";
import {AddEventComponent} from "./components/board/add-event/add-event.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ClaimEventsComponent} from './components/claims/create-claim/claim-events/claim-events.component';
import {PaginationModule} from "ngx-bootstrap/pagination";
import {ModalModule} from "ngx-bootstrap/modal";
import {defineLocale} from "ngx-bootstrap/chronos";
import {ruLocale} from "ngx-bootstrap/locale";
import {AngularYandexMapsModule} from "angular8-yandex-maps";
import { ClaimViewComponent } from './components/claims/create-claim/claim-view/claim-view.component';
import { ContractOuComponent } from './components/claims/create-claim/contract-ou/contract-ou.component';
import { MyAgentsComponent } from './components/profile/my-agents/my-agents.component';
import {NewsComponent} from "./components/news/news.component";
import {AnalyticsComponent} from "./components/analytics/analytics.component";
import {AdvanceComponent} from "./components/claims/create-claim/advance/advance.component";

registerLocaleData(localeRu, localeKz);
defineLocale('ru', ruLocale);

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, 'assets/i18n/', '.json');
}

export let options: Partial<IConfig> | (() => Partial<IConfig>);

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: 'indigo',
  bgsPosition: POSITION.centerCenter,
  bgsSize: 80,
  bgsType: SPINNER.threeStrings, // background spinner type
  fgsType: SPINNER.threeStrings, // foreground spinner type
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 5 // progress bar thickness
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
    LoginComponent,
    DicControlComponent,
    MyObjectsComponent,
    MyClaimsComponent,
    HomeComponent,
    CreateClaimBtnComponent,
    ChartsComponent,
    CalendarComponent,
    MyClientsComponent,
    ClientCardComponent,
    YandexMapComponent,
    NavComponent,
    FooterComponent,
    LoginModalComponent,
    CloseDealComponent,
    AddEventComponent,
    ClaimEventsComponent,
    ClaimViewComponent,
    ContractOuComponent,
    MyAgentsComponent,
    NewsComponent,
    AnalyticsComponent,
    ModalComponent,
    AdvanceComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
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
        // AngularYandexMapsModule.forRoot('658f67a2-fd77-42e9-b99e-2bd48c4ccad4'),
        ChartsModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
        NgbModule,
        AngularYandexMapsModule
    ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    UploaderService,
    ExitDeactivate,
    UserService,
    NotificationService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ProfileComponent,
    CreateClaimComponent,
    ModalComponent
  ],
  schemas: [NO_ERRORS_SCHEMA],

})
export class AppModule {
}
