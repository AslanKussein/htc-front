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
import {AddEventComponent} from "./components/board/add-event/add-event.component";
import {ClientCardComponent} from "./components/profile/my-clients/client-card/client-card.component";
import {ClaimViewComponent} from "./components/claims/create-claim/claim-view/claim-view.component";
import {CompareComponent} from "./components/compare/compare.component";
import {OrganizationComponent} from "./components/organization/organization.component";

// определение дочерних маршрутов
const itemRoutes: Routes = [
  {path: 'close-deal/:operationId', component: CloseDealComponent, canActivate: [AuthGuard]},
  {path: 'add-event', component: AddEventComponent, canActivate: [AuthGuard]}
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
  {path: 'create-claim/:id', component: CreateClaimComponent, canActivate: [AuthGuard], canDeactivate: [ExitDeactivate]},
  {path: 'create-claim-view/:id', component: ClaimViewComponent, canActivate: [AuthGuard]},
  {path: 'create-claim', component: CreateClaimComponent, canActivate: [AuthGuard], canDeactivate: [ExitDeactivate]},
  {path: 'client-card/:id', component: ClientCardComponent, canActivate: [AuthGuard]},
  {path: 'compare', component: CompareComponent, canActivate: [AuthGuard]},
  {path: 'organizations', component: OrganizationComponent, canActivate: [AuthGuard]},


];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
