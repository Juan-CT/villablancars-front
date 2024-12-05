import { Component } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Usuario } from '../../../auth/usuario';
import { GestUserService } from '../../../services/gest-user.service';
import { Cita } from '../../admin-page/modelo-cita';
import { Router } from '@angular/router';
import { CarServiceService } from '../../../services/car-service.service';
import { Cambio, Carroceria, Coche, Marca } from '../../admin-page/modelo-coche';
import { CarAppointmentDataService } from '../../../services/car-appointment-data.service';
import { SwalService } from '../../../shared/swal.service';

@Component({
  selector: 'app-citas-usuario',
  templateUrl: './citas-usuario.component.html',
  styleUrl: './citas-usuario.component.css'
})
export class CitasUsuarioComponent {

  usuarioLogueado: Usuario | null = null;
  citas: Cita[] = [];
  marcas: Marca[] = [];
  carrocerias: Carroceria[] = [];
  cambios: Cambio[] = [
    { id: 1, tipo: 'Automático' },
    { id: 2, tipo: 'Manual' }
  ];

  constructor(private authService: AuthService, private gestUserService: GestUserService,
    private router: Router, private carService: CarServiceService, private carAppointmentDataService: CarAppointmentDataService,
    private swalService: SwalService
  ) {}

  ngOnInit() {
    this.authService.usuario$.subscribe(usuario => {
      this.usuarioLogueado = usuario;
    });

    if (this.usuarioLogueado) {
      this.gestUserService.obtenerCitasUsuario(this.usuarioLogueado?.idFirebase).subscribe(
        (datos) => {
          if (datos && datos.citas.length > 0) {
            this.citas = datos.citas.map((cita: Cita) => ({
              ...cita,
              usuario: this.usuarioLogueado
            }));
            this.citas.forEach(cita => {
              cita.hora = cita.hora.substring(0, 5);
            });
          } else {
            this.citas = [];
          }
        }, () => {
          this.swalService.mostrarMensajeText('Error', 'No se han podido obtener las citas', 'error');
        }
      )
    }
    this.carService.obtenerMarcasCarrocerias().subscribe(
      (datos) => {
        this.marcas = datos.marcas;
        this.marcas.sort((a, b) => a.id - b.id);
        this.carrocerias = datos.carrocerias;
        this.carrocerias.sort((a, b) => a.id - b.id);
      }, (error) => {
        console.error('Error al obtener los datos', error);
      });

  }

  anularCita(idCita: number) {
    this.gestUserService.anularCita(idCita).subscribe(
      () => {
        this.swalService.mostrarMensajeText('Exito', 'Cita anulada', 'success');
        this.citas.filter(cita => cita.id !== idCita);
      }, () => {
        this.swalService.mostrarMensajeText('Error', 'Error al intentar anular la cita', 'error');
      }
    )
  }

  modificarCita(cita: Cita) {
    this.carAppointmentDataService.setDatosCita({cita});
    this.router.navigate(['/cita']);
  }

  verCoche(coche: Coche) {
    this.carAppointmentDataService.setDatosCoche({
      coche: coche,
      marca: this.marcas[coche.marca_id - 1].nombre,
      carroceria: this.carrocerias[coche.carroceria_id - 1].nombre,
      cambio: this.cambios[coche.cambio_id - 1].tipo
    });

    this.router.navigate(['/coches', coche.id],);
  }

  fechaCitaValida(fecha: string): boolean {
    const hoy = new Date();
    const fechaCita = new Date(fecha);
    return fechaCita < hoy;
  }

}
