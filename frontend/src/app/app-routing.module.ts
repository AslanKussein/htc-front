import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from "./helpers/auth.guard";
import {ClaimsComponent} from "./components/claims/claims.component";
import {ExitDeactivate} from "./helpers/canDeactivate/exitDeactivate";
import {LoginComponent} from "./components/login/login.component";
import {BoardComponent} from "./components/board/board.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {ObjectsComponent} from "./components/objects/objects.component";
import {StaffsComponent} from "./components/staffs/staffs.component";
import {AnalyticsComponent} from "./components/analytics/analytics.component";
import {CreateClaimComponent} from "./components/claims/create-claim/create-claim.component";
import {DicControlComponent} from "./components/dic-control/dic-control.component";
import {HomeComponent} from "./components/home/home.component";
import {YandexMapComponent} from "./components/claims/create-claim/yandex-map/yandex-map.component";
import {NewsComponent} from "./components/news/news.component";
import {CloseDealComponent} from "./components/board/close-deal/close-deal.component";
import {ActsComponent} from "./components/claims/create-claim/acts/acts.component";

// определение дочерних маршрутов
const itemRoutes: Routes = [
  {path: 'close-deal/:operationId', component: CloseDealComponent, canActivate: [AuthGuard]},
];

const createClaimChild: Routes = [
  {path: 'add-event', component: ActsComponent, canActivate: [AuthGuard]},
];

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full', canActivate: [AuthGuard]},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'claims', component: ClaimsComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'board', component: BoardComponent, canActivate: [AuthGuard], children: itemRoutes},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], canDeactivate: [ExitDeactivate]},
  {path: 'objects', component: ObjectsComponent, canActivate: [AuthGuard]},
  {path: 'staffs', component: StaffsComponent, canActivate: [AuthGuard]},
  {path: 'dic-control', component: DicControlComponent, canActivate: [AuthGuard]},
  {path: 'yandex-map', component: YandexMapComponent, canActivate: [AuthGuard]},
  {path: 'news', component: NewsComponent, canActivate: [AuthGuard]},
  {path: 'analytics', component: AnalyticsComponent, canActivate: [AuthGuard]},
  {path: 'create-claim/:id', component: CreateClaimComponent, canActivate: [AuthGuard], children: createClaimChild},
  {path: 'create-claim', component: CreateClaimComponent, canActivate: [AuthGuard], canDeactivate: [ExitDeactivate], children: createClaimChild},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true}),],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
