import { Component, Input } from '@angular/core';
import { Cambio, Carroceria, Coche, Marca } from '../../admin-page/modelo-coche';
import { Router } from '@angular/router';
import { CarAppointmentDataService } from '../../../services/car-appointment-data.service';

@Component({
  selector: 'app-car-card',
  templateUrl: './car-card.component.html',
  styleUrl: './car-card.component.css'
})
export class CarCardComponent {

  @Input() coche!: Coche;
  @Input() marcas: Marca[] = [];
  @Input() carrocerias: Carroceria[] = [];
  @Input() cambios: Cambio[] = [];

  indexImagen: number = 0;
  imagenFade: boolean = false;

  constructor(private router: Router, private carDataService: CarAppointmentDataService) {

  }

  verCoche(): void {
    this.carDataService.setDatosCoche({
      coche: this.coche,
      marca: this.marcas[this.coche.marca_id - 1].nombre,
      carroceria: this.carrocerias[this.coche.carroceria_id - 1].nombre,
      cambio: this.cambios[this.coche.cambio_id - 1].tipo
    });

    this.router.navigate(['/coches', this.coche.id],);
  }

  imagenSiguiente() {
    this.imagenFade = true;
    setTimeout(() => {
      this.indexImagen = (this.indexImagen + 1) % this.coche.imagenes!.length;
      this.imagenFade = false;
    }, 400);
  }

  imagenAnterior() {
    this.imagenFade = true;
    setTimeout(() => {
      this.indexImagen = (this.indexImagen - 1 + this.coche.imagenes!.length) % this.coche.imagenes!.length;
      this.imagenFade = false;
    }, 400);
  }

}
