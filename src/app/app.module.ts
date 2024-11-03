import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SharedModule } from './shared/shared.module';
import { AuthModule} from './auth/auth.module'
import { FirebaseModule } from './firebase/firebase.module';

import { PruebaConexionComponent } from './prueba-conexion/prueba-conexion.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { SellPageComponent } from './pages/sell-page/sell-page.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { CochesComponent } from './pages/admin-page/coches/coches.component';
import { CitasComponent } from './pages/admin-page/citas/citas.component';
import { UsuariosComponent } from './pages/admin-page/usuarios/usuarios.component';
import { CarCardComponent } from './pages/search-page/car-card/car-card.component'

@NgModule({
  declarations: [
    AppComponent,
    PruebaConexionComponent,
    LandingPageComponent,
    SearchPageComponent,
    SellPageComponent,
    UserPageComponent,
    AdminPageComponent,
    CochesComponent,
    CitasComponent,
    UsuariosComponent,
    CarCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    AuthModule,
    FirebaseModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
