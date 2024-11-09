import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarDataService {

  private datosCoche: any = {};

  constructor() { }

  getdatosCoche() {
    return this.datosCoche;
  }

  setDatosCoche(datos: any) {
    this.datosCoche = datos;
  }
}
