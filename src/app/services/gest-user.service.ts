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

  obtenerHorasCitasDia(fecha: string): Observable<any> {
    return this.http.get(`${environment.apiURL}/usuario/horas-citas`, {
      params: { fecha: fecha }
    });
  }

  obtenerUsuarios(): Observable<any> {
    return this.http.get(`${environment.apiURL}/usuarios`);
  }
  // ADMIN-TODAS LAS CITAS
  obtenerCitas(): Observable<any> {
    return this.http.get(`${environment.apiURL}/citas`);
  }
  // ADMIN-ACTUALIZAR-ESTADO-CITA
  actualizarEstadoCita(idCita: number, nuevoEstado: string): Observable<any> {
    return this.http.put(`${environment.apiURL}/citas/${idCita}/estado`, {
        estado: nuevoEstado
      }
    );
  }
  // USUARIO-CREAR-CITA
  crearCita(cita: FormData): Observable<any> {
    return this.http.post(`${environment.apiURL}/guardar-cita`, cita);
  }
  // USUARIO-MODIFICAR-CITA
  modificarCita(cita: FormData, citaId: number): Observable<any> {
    return this.http.post(`${environment.apiURL}/guardar-cita`, cita, {
      params: { citaId: citaId }
    });
  }
  // USUARIO-CITAS
  obtenerCitasUsuario(idF: string): Observable<any> {
    return this.http.get(`${environment.apiURL}/usuario/citas`, {
      params: { idFirebase: idF }
    });
  }
  // USUARIO-ANULAR-CITA
  anularCita(idCita: number): Observable<any> {
    return this.http.delete(`${environment.apiURL}/usuario/eliminar-cita`, {
      body: {
        idCita: idCita
      }
    });
  }
  // FORMULARIO-VENDER
  enviarFormVenta(datos: FormData): Observable<any> {
    return this.http.post(`${environment.apiURL}/formulario-venta`, datos);
  }
  // FORMULARIO-CONTACTO
  enviarFormContacto(datos: any): Observable<any> {
    return this.http.post(`${environment.apiURL}/formulario-contacto`, datos);
  }
}
