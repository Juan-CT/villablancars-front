import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SharedModule } from './shared/shared.module';
import { AuthModule} from './auth/auth.module'
import { FirebaseModule } from './firebase/firebase.module';

import { PruebaConexionComponent } from './prueba-conexion/prueba-conexion.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { SellPageComponent } from './pages/sell-page/sell-page.component';
import { UserPageComponent } from './pages/user-page/user-page.component'

@NgModule({
  declarations: [
    AppComponent,
    PruebaConexionComponent,
    LandingPageComponent,
    SearchPageComponent,
    SellPageComponent,
    UserPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    AuthModule,
    FirebaseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
