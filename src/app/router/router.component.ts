import { LandingComponent } from './../components/landing.component/landing.component';
import { CollabComponent } from './../components/collab.component/collab.component';
import { GithubComponent } from './../components/github.component/github.component';
import { StyleListComponent } from './../components/style.list.component/style.list.component';
import { TaskChartComponent } from './../components/charts/task.chart.component/task.chart.component';
import { BurndownComponent } from './../components/charts/burndown.component/burndown.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from '../components/board.component/board.component';
import { LoginComponent } from '../components/login.component/login.component';
import { SignUpComponent } from '../components/signup.component/signup.component';
import { UserDashboardComponent } from '../components/user.dashboard.component/user.dashboard.component';
import { FirebaseAuthentication } from '../services/authentication/firebase.authentication'

const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  {
    path: 'board/:id', component: BoardComponent,
    canActivate: [FirebaseAuthentication]
  },
  { path: 'login', component: LoginComponent },
  { path: 'style', component: StyleListComponent },
  { path: 'signup', component: SignUpComponent },
  { path: '*', component: LandingComponent },
  { path: 'landing', component: LandingComponent },
  { path: 'git', component: GithubComponent },

  {
    path: 'dashboard', component: UserDashboardComponent,
    canActivate: [FirebaseAuthentication]
  },
  {
    path: 'burndown/:id', component: BurndownComponent,
    canActivate: [FirebaseAuthentication]
  },
  {
    path: 'taskchart/:id', component: TaskChartComponent,
    canActivate: [FirebaseAuthentication]
  },
  {
    path: 'collabs', component: CollabComponent,
    canActivate: [FirebaseAuthentication]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [FirebaseAuthentication]
})
export class AppRoutingModule { }
