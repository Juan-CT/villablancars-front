import { Component, OnInit } from '@angular/core';
import { GestUserService } from '../../../services/gest-user.service';
import { Cita } from '../modelo-cita';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.css'
})
export class CitasComponent implements OnInit {

  citas: Cita[] = [];
  mostrarModal: boolean = false;
  citaSeleccionada: Cita | null = null;
  estados: ('confirmada' | 'cancelada' | 'completada')[] = [
    'confirmada', 'cancelada', 'completada'];

  constructor(private gestUserService: GestUserService, private authService: AuthService) {

  }

  ngOnInit(): void {
    this.gestUserService.obtenerCitas().subscribe((datos) => {
      this.citas = datos.citas;
    });
  }

  abrirModal(cita: Cita) {
    this.citaSeleccionada = cita;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  cambiarEstado(idCita: number, nuevoEstado: 'confirmada' | 'cancelada' | 'completada'): void {
    this.gestUserService.actualizarEstadoCita(idCita, nuevoEstado).subscribe(() => {
      const citaActualizada = this.citas.find(c => c.id === idCita);
      if (citaActualizada) {
        citaActualizada.estado = nuevoEstado;
      }
      this.authService.mostrarMensaje('Estado modificado', 'Notificación enviada al usuario', 'success');
      this.mostrarModal = false;
    },
      (error) => {
        this.authService.mostrarMensaje('Error', 'No se ha podido modificar el estado de la cita', 'error');
        console.error('Error al actualizar el estado:', error);
      }
    );
  }
}
