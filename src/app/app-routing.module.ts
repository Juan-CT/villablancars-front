import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { SellPageComponent } from './pages/sell-page/sell-page.component';
import { LoginPageComponent } from './auth/pages/login-page/login-page.component';
import { RegisterPageComponent } from './auth/pages/register-page/register-page.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';

import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { CochesComponent } from './pages/admin-page/coches/coches.component';
import { CitasComponent } from './pages/admin-page/citas/citas.component';
import { UsuariosComponent } from './pages/admin-page/usuarios/usuarios.component';
import { CarPageComponent } from './pages/search-page/car-page/car-page.component';
import { CochesUsuarioComponent } from './pages/user-page/coches-usuario/coches-usuario.component';
import { CitasUsuarioComponent } from './pages/user-page/citas-usuario/citas-usuario.component';
import { DatosPerfilUsuarioComponent } from './pages/user-page/datos-perfil-usuario/datos-perfil-usuario.component';
import { AppointmentPageComponent } from './pages/appointment-page/appointment-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'buscar-coche', component: SearchPageComponent },
  { path: 'coches/:id', component: CarPageComponent },
  { path: 'vender-coche', component: SellPageComponent },
  { path: 'contacto', component: ContactPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'registro', component: RegisterPageComponent },
  { path: 'cita', component: AppointmentPageComponent, canActivate: [authGuard] },

  {
    path: 'usuario', component: UserPageComponent, canActivate: [authGuard], children: [
      { path: '', redirectTo: 'citas-usuario', pathMatch: 'full' },
      { path: 'coches-usuario', component: CochesUsuarioComponent },
      { path: 'citas-usuario', component: CitasUsuarioComponent },
      { path: 'datos-perfil-usuario', component: DatosPerfilUsuarioComponent }
    ]
  },
  {
    path: 'admin', component: AdminPageComponent, canActivate: [adminGuard], children: [
      { path: 'coches', component: CochesComponent },
      { path: 'citas', component: CitasComponent },
      { path: 'usuarios', component: UsuariosComponent },
    ],
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
