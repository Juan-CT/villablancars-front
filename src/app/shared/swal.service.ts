import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Cambio, Carroceria, Coche, Marca } from '../pages/admin-page/modelo-coche';

@Injectable({
  providedIn: 'root'
})
export class SwalService {

  constructor() { }

  mostrarMensajeText(titulo: string, texto: string, icono: any, cancelar: boolean = false): Promise<any> {
    return Swal.fire({
      title: titulo,
      text: texto,
      icon: icono,
      showCancelButton: cancelar,
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

  mostrarMensajeHtml(titulo: string, html: string, icono: any, didRenderCallback?: () => void): Promise<any> {
    return Swal.fire({
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

  mostrarMensajeCrearCoche(marcas: Marca[], carrocerias: Carroceria[],
    cambios: Cambio[], formValues: any): Promise<any> {
    return Swal.fire({
      title: 'Confirmar cambios',
      html: `
        <strong>Marca:</strong> ${marcas.find(m => m.id == formValues.marca)?.nombre} <br>
        <strong>Carrocería:</strong> ${carrocerias.find(c => c.id == formValues.carroceria)?.nombre} <br>
        <strong>Modelo:</strong> ${formValues.modelo} <br>
        <strong>Año:</strong> ${formValues.anio} <br>
        <strong>Color:</strong> ${formValues.color} <br>
        <strong>Cambio:</strong> ${cambios.find(c => c.id == formValues.cambio)?.tipo} <br>
        <strong>Kilómetros:</strong> ${formValues.kilometros} Km <br>
        <strong>Autonomía:</strong> ${formValues.autonomia} Km <br>
        <strong>Potencia:</strong> ${formValues.potencia} CV <br>
        <strong>Precio:</strong> ${formValues.precio} Euros <br>
        <strong>Descripción:</strong> ${formValues.descripcion} <br>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      background: '#fff',
      color: '#333',
      confirmButtonColor: '#25d366',
      cancelButtonColor: '#ff6b6b',
    });
  }

  mostrarMensajeEditarCoche(marcas: Marca[], carrocerias: Carroceria[],
    cambios: Cambio[], formValues: any, cocheSinCambios: Coche): Promise<any> {
    return Swal.fire({
      title: 'Confirmar cambios',
      html: `
        <strong>Marca:</strong> ${marcas.find(m => m.id === cocheSinCambios.marca_id)?.nombre} ->
        ${marcas.find(m => m.id == formValues.marca)?.nombre} <br>
        <strong>Carrocería:</strong> ${carrocerias.find
          (c => c.id === cocheSinCambios.carroceria_id)?.nombre} ->
        ${carrocerias.find(c => c.id == formValues.carroceria)?.nombre} <br>
        <strong>Modelo:</strong> ${cocheSinCambios.modelo} -> ${formValues.modelo} <br>
        <strong>Año:</strong> ${cocheSinCambios.anio} -> ${formValues.anio} <br>
        <strong>Color:</strong> ${cocheSinCambios.color} -> ${formValues.color} <br>
        <strong>Cambio:</strong> ${cambios.find(c => c.id === cocheSinCambios.cambio_id)?.tipo} ->
        ${cambios.find(c => c.id == formValues.cambio)?.tipo} <br>
        <strong>Kilómetros:</strong> ${cocheSinCambios.kilometros} -> ${formValues.kilometros} Km <br>
        <strong>Autonomía:</strong> ${cocheSinCambios.autonomia} -> ${formValues.autonomia} Km <br>
        <strong>Potencia:</strong> ${cocheSinCambios.potencia} -> ${formValues.potencia} CV <br>
        <strong>Precio:</strong> ${cocheSinCambios.precio} -> ${formValues.precio} Euros <br>
        <strong>Descripción:</strong> ${cocheSinCambios.descripcion} -> ${formValues.descripcion} <br>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      background: '#fff',
      color: '#333',
      confirmButtonColor: '#25d366',
      cancelButtonColor: '#ff6b6b',
    });
  }

  mostrarMensajeCita(modelo: string, fecha: string, formValues: any): Promise <any> {
    return Swal.fire({
      title: 'Confirmar envío',
      html: `
        <strong>Modelo coche: </strong> ${modelo}<br>
        <strong>Fecha: </strong> ${fecha}<br>
        <strong>Hora: </strong> ${formValues.hora}<br>
        <strong>Mensaje: </strong> ${formValues.descripcion}<br>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      background: '#fff',
      color: '#333',
      confirmButtonColor: '#25d366',
      cancelButtonColor: '#ff6b6b',
    });
  }

}
