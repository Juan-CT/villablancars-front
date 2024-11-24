import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarAppointmentDataService {

  private datosCoche: any = {};
  private datosCita: any = {};

  constructor() { }

  getdatosCoche() {
    return this.datosCoche;
  }

  setDatosCoche(datos: any) {
    this.datosCoche = datos;
  }

  getDatosCita() {
    return this.datosCita;
  }

  setDatosCita(datos: any) {
    this.datosCita = datos;
  }
}
