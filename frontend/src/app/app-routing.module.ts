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
import {MyObjectsComponent} from "./profile/my-objects/my-objects.component";
import {MyClaimsComponent} from "./profile/my-claims/my-claims.component";
import {HomeComponent} from "./home/home.component";


const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full', canActivate: [AuthGuard]},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'claims', component: ClaimsComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'board', component: BoardComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'objects', component: ObjectsComponent, canActivate: [AuthGuard]},
  {path: 'staffs', component: StaffsComponent, canActivate: [AuthGuard]},
  {path: 'dic-control', component: DicControlComponent, canActivate: [AuthGuard]},
  {path: 'my-objects', component: MyObjectsComponent, canActivate: [AuthGuard]},
  {path: 'my-claims', component: MyClaimsComponent, canActivate: [AuthGuard]},

  {path: 'news', component: NewsComponent, canActivate: [AuthGuard]},
  {path: 'analytics', component: AnalyticsComponent, canActivate: [AuthGuard]},
  {path: 'create-claim/:id', component: CreateClaimComponent, canActivate: [AuthGuard]},
  {path: 'create-claim', component: CreateClaimComponent, canActivate: [AuthGuard], canDeactivate: [ExitDeactivate]},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {useHash: true}),],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
