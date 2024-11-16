import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Coche } from '../../admin-page/modelo-coche';
import { CarDataService } from '../../../services/car-data.service';
import { AuthService } from '../../../auth/auth.service';

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

  constructor(private router: Router, private carDataService: CarDataService,
    private authService: AuthService
  ) { }

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

  cambiarImagen(index: number) {
    this.imagenFade = true;
    setTimeout(() => {
      this.imagenMuestra = this.coche!.imagenes![index].url;
      this.imagenFade = false;
    }, 200);
  }

}
