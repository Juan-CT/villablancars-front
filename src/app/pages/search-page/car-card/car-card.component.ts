import { Component, Input } from '@angular/core';
import { Cambio, Carroceria, Coche, Marca } from '../../admin-page/modelo-coche';

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
