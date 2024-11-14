import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Coche } from '../../admin-page/modelo-coche';
import { CarDataService } from '../../../services/car-data.service';

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

  indexImagen: number = 0;
  imagenFade: boolean = false;

  constructor(private router: Router, private carDataService: CarDataService) {

  }

  ngOnInit(): void {
    const datosCoche = this.carDataService.getdatosCoche();
    this.coche = datosCoche.coche;
    this.marca = datosCoche.marca;
    this.carroceria = datosCoche.carroceria;
    this.cambio = datosCoche.cambio;

    if (!this.coche) {
     this.router.navigate(['/']);
    }
  }

  imagenSiguiente() {
    this.imagenFade = true;
    setTimeout(() => {
      this.indexImagen = (this.indexImagen + 1) % this.coche!.imagenes!.length;
      this.imagenFade = false;
    }, 400);
  }

  imagenAnterior() {
    this.imagenFade = true;
    setTimeout(() => {
      this.indexImagen = (this.indexImagen - 1 + this.coche!.imagenes!.length) % this.coche!.imagenes!.length;
      this.imagenFade = false;
    }, 400);
  }
}
