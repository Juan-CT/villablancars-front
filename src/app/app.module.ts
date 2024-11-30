import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SharedModule } from './shared/shared.module';
import { AuthModule} from './auth/auth.module'
import { FirebaseModule } from './firebase/firebase.module';
import { CalendarModule } from 'primeng/calendar';

import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { SellPageComponent } from './pages/sell-page/sell-page.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { CochesComponent } from './pages/admin-page/coches/coches.component';
import { CitasComponent } from './pages/admin-page/citas/citas.component';
import { UsuariosComponent } from './pages/admin-page/usuarios/usuarios.component';
import { CarCardComponent } from './pages/search-page/car-card/car-card.component';
import { CarPageComponent } from './pages/search-page/car-page/car-page.component';
import { CochesUsuarioComponent } from './pages/user-page/coches-usuario/coches-usuario.component';
import { CitasUsuarioComponent } from './pages/user-page/citas-usuario/citas-usuario.component';
import { DatosPerfilUsuarioComponent } from './pages/user-page/datos-perfil-usuario/datos-perfil-usuario.component';
import { AppointmentPageComponent } from './pages/appointment-page/appointment-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component'

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    SearchPageComponent,
    SellPageComponent,
    UserPageComponent,
    AdminPageComponent,
    CochesComponent,
    CitasComponent,
    UsuariosComponent,
    CarCardComponent,
    CarPageComponent,
    CochesUsuarioComponent,
    CitasUsuarioComponent,
    DatosPerfilUsuarioComponent,
    AppointmentPageComponent,
    ContactPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    AuthModule,
    FirebaseModule,
    ReactiveFormsModule,
    FormsModule,
    CalendarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
