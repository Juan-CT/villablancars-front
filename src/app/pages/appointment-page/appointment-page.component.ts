import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CarAppointmentDataService } from '../../services/car-appointment-data.service';
import { Coche } from '../admin-page/modelo-coche';
import { AuthService } from '../../auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../../auth/usuario';
import { GestUserService } from '../../services/gest-user.service';
import { Cita } from '../admin-page/modelo-cita';
import { SwalService } from '../../shared/swal.service';

@Component({
  selector: 'app-appointment-page',
  templateUrl: './appointment-page.component.html',
  styleUrl: './appointment-page.component.css'
})
export class AppointmentPageComponent implements OnInit {

  usuario: Usuario | null = null;
  coche: Coche | null = null;
  cita: Cita | null = null;
  editarCita: boolean = false;
  formCrearCita: FormGroup;

  hoy: Date = new Date();
  diaElegido: string | null = null;
  horasCitas: string[] = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '16:00', '17:00', '18:00', '19:00', '20:00'
  ];
  horasOcupadas: string[] = [];
  horaElegida: string = '';

  constructor(private carDataService: CarAppointmentDataService, private authService: AuthService,
    private fb: FormBuilder, private gestUserService: GestUserService, private location: Location,
    private swalService: SwalService
  ) {
    this.formCrearCita = this.fb.group({
      nombre: [{ value: this.usuario?.nombre, disabled: true }],
      email: [{ value: this.usuario?.email, disabled: true }],
      coche: [{ value: this.coche?.id, disabled: true }],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      descripcion: ''
    });
  }

  ngOnInit() {
    this.authService.usuario$.subscribe(usuario => {
      this.usuario = usuario;
    });

    this.cita = this.carDataService.getDatosCita().cita;
    if (this.cita) {
      this.editarCita = true;
      this.coche = this.cita.coche;
      this.formCrearCita.patchValue({
        descripcion: this.cita.descripcion || ''
      });
    } else {
      this.coche = this.carDataService.getdatosCoche().coche;
    }

  }

  guardarCita() {
    const formValues = this.formCrearCita.value;
    const formData = new FormData();

    formData.append('usuario', this.usuario!.idFirebase);
    formData.append('coche_id', Number(this.coche!.id).toString());
    formData.append('fecha', formValues.fecha);
    formData.append('hora', formValues.hora);
    formData.append('descripcion', formValues.descripcion);
    const fechaSwal: string = new Date(formValues.fecha).toLocaleDateString('es-ES');

    this.swalService.mostrarMensajeCita(this.coche!.modelo, fechaSwal, formValues)
      .then((result) => {
        if (result.isConfirmed) {
          if (this.editarCita) {
            this.gestUserService.modificarCita(formData, this.cita!.id).subscribe(() => {
              this.swalService.mostrarMensajeText('Éxito', 'Cita modificada correctamente.', 'success');
              this.editarCita = false;
              this.location.back();
            }, (error) => {
              if (error.status === 422) {
                this.swalService.mostrarMensajeText('Error', 'Uno o varios datos introducidos no cumplen la validación.', 'error');
              } else {
                this.swalService.mostrarMensajeText('Error', 'Ocurrió un problema al crear la cita.', 'error');
              }
            });
          } else {
            this.gestUserService.crearCita(formData).subscribe(() => {
              this.swalService.mostrarMensajeText('Éxito', 'Cita creada correctamente.', 'success');
              this.location.back();
            }, (error) => {
              if (error.status === 422) {
                this.swalService.mostrarMensajeText('Error', 'Uno o varios datos introducidos no cumplen la validación.', 'error');
              } else {
                this.swalService.mostrarMensajeText('Error', 'Ocurrió un problema al crear la cita.', 'error');
              }
            });
          }
        }
      });
  }

  diaSeleccionado(fecha: Date) {
    this.diaElegido = this.formatearFecha(fecha);
    this.formCrearCita.patchValue({ fecha: this.diaElegido });
    if (this.diaElegido) {
      this.gestUserService.obtenerHorasCitasDia(this.diaElegido).subscribe(
        (datos) => {
          if (datos && datos.horas_ocupadas.length > 0) {
            this.horasOcupadas = datos.horas_ocupadas.map((hora: string) => hora.slice(0, 5));;
          } else {
            this.horasOcupadas = [];
          }
        }, (error) => {
          console.error('Error al obtener las horas ocupadas:', error);
        });
    }
  }

  cambiarHoraElegida(hora: string) {
    if (this.horasOcupadas.includes(hora)) return;

    if (this.horaElegida !== hora) {
      this.horaElegida = hora;
    } else {
      this.horaElegida = '';
    }
    this.formCrearCita.patchValue({ hora });
  }

  formatearFecha(fecha: Date): string {
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    return `${año}-${mes}-${dia}`;
  }

}
