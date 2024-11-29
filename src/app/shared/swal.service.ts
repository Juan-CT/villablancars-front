import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalService {

  constructor() { }

  mostrarMensaje(titulo: string, texto: string, icono: any): void {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: icono,
      confirmButtonText: 'Aceptar',
      background: '#fff',
      color: '#333',
      confirmButtonColor: '#25d366',
      cancelButtonColor: '#ff6b6b',
    });
  }

}
