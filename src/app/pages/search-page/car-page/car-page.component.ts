import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Coche } from '../../admin-page/modelo-coche';
import { CarAppointmentDataService } from '../../../services/car-appointment-data.service';
import { AuthService } from '../../../auth/auth.service';
import { GestUserService } from '../../../services/gest-user.service';
import { Location } from '@angular/common';
import { SwalService } from '../../../shared/swal.service';

@Component({
  selector: 'app-car-page',
  templateUrl: './car-page.component.html',
  styleUrl: './car-page.component.css'
})
export class CarPageComponent implements OnInit {

  coche: Coche | null = null;
  marca: string = '';
  carroceria: string = '';
  cambio: string = '';
  imagenMuestra: string = "assets/car-placeholder.jpg";

  indexImagen: number = 0;
  imagenFade: boolean = false;
  cuadrados: number[] = [];

  usuarioLogueado: boolean = false;
  modalVisible: boolean = false;

  constructor(private router: Router, private carDataService: CarAppointmentDataService,
    private authService: AuthService, private gestUserService: GestUserService,
    private location: Location, private swalService: SwalService) { }

  ngOnInit(): void {
    const datosCoche = this.carDataService.getdatosCoche();
    this.coche = datosCoche.coche;
    this.marca = datosCoche.marca;
    this.carroceria = datosCoche.carroceria;
    this.cambio = datosCoche.cambio;

    if (!this.coche) {
      this.router.navigate(['/']);
    }

    if (this.coche!.imagenes && this.coche!.imagenes.length > 0) {
      this.imagenMuestra = this.coche!.imagenes[0].url;
      this.cuadrados = Array.from({ length: this.coche!.imagenes.length }, (_, i) => i);
    }

    this.authService.usuario$.subscribe(usuario => {
      this.usuarioLogueado = usuario && usuario.emailVerificado ? true : false;
    });
  }

  cambiarImagen(index: number): void {
    this.imagenFade = true;
    setTimeout(() => {
      this.imagenMuestra = this.coche!.imagenes![index].url;
      this.imagenFade = false;
    }, 200);
  }

  guardarCocheUsuario(): void {
    let idF: any;
    this.authService.usuario$.subscribe(usuario => {
      idF = usuario?.idFirebase;
    });
    this.gestUserService.guardarCocheUsuario(this.coche!.id, idF)
      .subscribe(() => {
        this.swalService.mostrarMensajeText('Hecho', 'El coche ha sido guardado en tu historial', 'success')
      }, error => {
        this.swalService.mostrarMensajeText('Error', 'Ya tienes guardado este coche en tu historial', 'error')
        console.error('Error al guardar el coche en el historial', error)
      });
  }

  pedirCita() {

  }

  volverAtras(): void {
    this.location.back();
  }

  abrirModal(): void {
    this.modalVisible = true;
  }

  cerrarModal(): void {
    this.modalVisible = false;
  }

}
