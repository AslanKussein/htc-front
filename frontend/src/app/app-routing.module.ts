import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from "./helpers/auth.guard";
import {ClaimsComponent} from "./claims/claims.component";
import {ExitDeactivate} from "./canDeactivate/exitDeactivate";
import {LoginComponent} from "./login/login.component";
import {BoardComponent} from "./board/board.component";
import {ProfileComponent} from "./profile/profile.component";
import {ObjectsComponent} from "./objects/objects.component";
import {StaffsComponent} from "./staffs/staffs.component";
import {NewsComponent} from "./news/news.component";
import {AnalyticsComponent} from "./analytics/analytics.component";
import {CreateClaimComponent} from "./claims/create-claim/create-claim.component";
import {DicControlComponent} from "./dic-control/dic-control.component";


const routes: Routes = [
  {path: '', redirectTo: '/claims', pathMatch: 'full', canActivate: [AuthGuard]},
  {path: 'claims', component: ClaimsComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'board', component: BoardComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'objects', component: ObjectsComponent, canActivate: [AuthGuard]},
  {path: 'staffs', component: StaffsComponent, canActivate: [AuthGuard]},
  {path: 'dic-control', component: DicControlComponent, canActivate: [AuthGuard]},
  {path: 'news', component: NewsComponent, canActivate: [AuthGuard]},
  {path: 'analytics', component: AnalyticsComponent, canActivate: [AuthGuard]},
  {path: 'create-claim', component: CreateClaimComponent, canActivate: [AuthGuard], canDeactivate: [ExitDeactivate]},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {useHash: true}),],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
