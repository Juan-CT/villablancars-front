import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarServiceService {

  constructor(private http: HttpClient) { }

  crearCoche(){

  }

  editarCoche() {

  }

  eliminarCoche(){

  }

  obtenerCoches() {

  }

  obtenerMarcasCarrocerias(): Observable<any> {
    return this.http.get(`${environment.apiURL}/marcas-carrocerias`);
  }

}
