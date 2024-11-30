import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalService {

  constructor() { }

  mostrarMensajeText(titulo: string, texto: string, icono: any): void {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: icono,
      confirmButtonText: 'Aceptar',
      background: '#fff',
      color: '#333',
      confirmButtonColor: '#25d366',
      cancelButtonColor: '#ff6b6b',
      customClass: {
        popup: 'swal'
      },
    });
  }

  mostrarMensajeHtml(titulo: string, html: string, icono: any, didRenderCallback?: () => void): void {
    Swal.fire({
      title: titulo,
      html: html,
      icon: icono,
      confirmButtonText: 'Aceptar',
      background: '#fff',
      color: '#333',
      confirmButtonColor: '#25d366',
      cancelButtonColor: '#ff6b6b',
      customClass: {
        popup: 'swal'
      },
      didRender: didRenderCallback,
    });
  }

  mostrarMensajeForm(titulo: string, nombre: string, email: string, icono: any): Promise<any> {
    return Swal.fire({
      title: titulo,
      html: `
          <strong>Nombre: </strong> ${nombre} <br>
          <strong>Email: </strong> ${email}<br><br>
          <strong>Recibirás la respuesta en el email indicado</strong>
        `,
      icon: icono,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      background: '#fff',
      color: '#333',
      confirmButtonColor: '#25d366',
      cancelButtonColor: '#ff6b6b',
      customClass: {
        popup: 'swal'
      },
    });
  }

  updateMensaje(html: string, icon: any): void {
    Swal.update({
      html: html,
      icon: icon
    })
  }

}
