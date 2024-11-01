import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Coche, CocheCreacion } from '../pages/admin-page/modelo-coche';

@Injectable({
  providedIn: 'root'
})
export class CarServiceService {

  constructor(private http: HttpClient) { }

  crearCoche(coche: CocheCreacion): Observable<any>{
    return this.http.post(`${environment.apiURL}/guardar-coche`, coche);
  }

  editarCoche() {

  }

  eliminarCoche(coche_id: number): Observable<any>{
    return this.http.delete(`${environment.apiURL}/eliminar-coche/${coche_id}`);
  }

  obtenerCoches(): Observable<any> {
    return this.http.get(`${environment.apiURL}/obtener-coches`);
  }

  obtenerMarcasCarrocerias(): Observable<any> {
    return this.http.get(`${environment.apiURL}/marcas-carrocerias`);
  }

}
