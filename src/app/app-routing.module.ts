import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { SellPageComponent } from './pages/sell-page/sell-page.component';
import { LoginPageComponent } from './auth/pages/login-page/login-page.component';
import { RegisterPageComponent } from './auth/pages/register-page/register-page.component';
import { UserPageComponent } from './pages/user-page/user-page.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'buscar-coche', component: SearchPageComponent },
  { path: 'vender-coche', component: SellPageComponent },
  { path: 'login', component: LoginPageComponent},
  { path: 'registro', component: RegisterPageComponent},
  { path: 'usuario', component: UserPageComponent},


  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
