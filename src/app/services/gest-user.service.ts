import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GestUserService {

  constructor(private http: HttpClient) { }

  guardarCocheUsuario(idCoche: number, idFirebase: string): Observable<any> {
    return this.http.post(`${environment.apiURL}/usuario/coche-guardar`, {
      coche_id: idCoche,
      firebase_id: idFirebase
    });
  }

  obtenerCochesUsuario(idFirebase: string): Observable<any> {
    return this.http.get(`${environment.apiURL}/usuario/coches-guardados`, {
      params: { firebase_id: idFirebase }
    });
  }

  eliminarCocheUsuario(idCoche: number, idFirebase: string): Observable<any> {
    return this.http.delete(`${environment.apiURL}/usuario/eliminar-coche`, {
      body: {
        coche_id: idCoche,
        firebase_id: idFirebase
      }
    });
  }
}
