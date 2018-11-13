import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PublishComponent } from './publish/publish.component';
import { AuthGuardService } from './services/auth-guard.service';
import { LiftComponent } from './lift/lift.component';
import { BoardComponent } from './board/board.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'publish', component: PublishComponent, canActivate:[AuthGuardService]}, // route protected from unauthenticated users
  { path: 'lift/:id', component: LiftComponent, canActivate:[AuthGuardService]},
  { path: 'board', component: BoardComponent, canActivate:[AuthGuardService]},
  { path: '**', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})

export class AppRoutingModule { }
