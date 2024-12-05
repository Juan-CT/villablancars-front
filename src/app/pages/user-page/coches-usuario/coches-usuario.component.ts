import { Component, OnInit } from '@angular/core';
import { CarServiceService } from '../../../services/car-service.service';
import { Cambio, Carroceria, Coche, Marca } from '../../admin-page/modelo-coche';
import { GestUserService } from '../../../services/gest-user.service';
import { AuthService } from '../../../auth/auth.service';
import { CarAppointmentDataService } from '../../../services/car-appointment-data.service';
import { Router } from '@angular/router';
import { SwalService } from '../../../shared/swal.service';

@Component({
  selector: 'app-coches-usuario',
  templateUrl: './coches-usuario.component.html',
  styleUrl: './coches-usuario.component.css'
})

export class CochesUsuarioComponent implements OnInit {

  marcas: Marca[] = [];
  carrocerias: Carroceria[] = [];
  cambios: Cambio[] = [
    { id: 1, tipo: 'Automático' },
    { id: 2, tipo: 'Manual' }
  ];
  coches: Coche[] = [];
  idF: string = '';

  constructor(private carService: CarServiceService, private gestUserService: GestUserService,
    private authService: AuthService, private carDataService: CarAppointmentDataService,
    private router: Router, private swalService: SwalService
  ) { }

  ngOnInit(): void {

    this.carService.obtenerMarcasCarrocerias().subscribe(
      (datos) => {
        this.marcas = datos.marcas;
        this.marcas.sort((a, b) => a.id - b.id);
        this.carrocerias = datos.carrocerias;
        this.carrocerias.sort((a, b) => a.id - b.id);
      }, (error) => {
        console.error('Error al obtener los datos', error);
      });

    this.authService.usuario$.subscribe(usuario => {
      if (usuario?.idFirebase) {
        this.idF = usuario.idFirebase;
        this.gestUserService.obtenerCochesUsuario(this.idF).subscribe(
          (datos) => {
            this.coches = datos.coches;
          }, (error) => {
            this.swalService.mostrarMensajeText('Error', 'Error al obtener el historial de coches', 'error');
            console.error('Error al obtener los coches del historial', error);
          });
      }
    });
  }

  eliminarCoche(idCoche: number) {
    this.gestUserService.eliminarCocheUsuario(idCoche, this.idF).subscribe(
      () => {
        this.swalService.mostrarMensajeText('Borrado', 'Eliminado del historial', 'success');
        this.coches = this.coches.filter(coche => coche.id !== idCoche);
      }, (error) => {
        this.swalService.mostrarMensajeText('Error', 'No se pudo eliminar el coche del historial', 'error');
        console.error('Error: ', error);
      }
    )
  }

  citaCocheSeleccionado(coche: Coche) {
    this.carDataService.setDatosCoche({
      coche: coche
    });

    this.router.navigate(['/cita'],);
  }


}
