import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { SignupComponent } from './modules/signup/signup.component';
import { SigninComponent } from './modules/signin/signin.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { PostsComponent } from './modules/posts/posts.component';
import { AuthGuard } from './shared/auth.guard';


const routes: Routes = [{
  path: '',
  redirectTo: '/log-in',
  pathMatch: 'full'
}, {
  path: 'log-in',
  component: SigninComponent
}, {
  path: 'sign-up',
  component: SignupComponent
}, {
  path: 'default/:id',
  component: DefaultComponent,
  children: [{
    path: '',
    component: DashboardComponent,
  }, {
    path: 'posts',
    component: PostsComponent
  }],
  canActivate: [AuthGuard]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
