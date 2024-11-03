import { Component, OnInit } from '@angular/core';
import { Cambio, Carroceria, Coche, Marca } from '../admin-page/modelo-coche';
import { CarServiceService } from '../../services/car-service.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})

export class SearchPageComponent implements OnInit{

  marcas: Marca[] = [];
  carrocerias: Carroceria[] = [];
  coches: Coche[] = [];
  cambios: Cambio[] = [
    { id: 1, tipo: 'Automático' },
    { id: 2, tipo: 'Manual' }
  ];

  constructor(private carService: CarServiceService) {

  }

  ngOnInit(): void{
    this.carService.obtenerMarcasCarrocerias().subscribe(
      (datos) => {
        this.marcas = datos.marcas;
        this.carrocerias = datos.carrocerias;
      }, (error) => {
        console.error('Error al obtener los datos', error);
      }
    );
    this.carService.obtenerCoches().subscribe(
      (coches) => {
        this.coches = coches;
      }, (error) => {
        console.error('Error al obtener los coches existentes', error);
      }
    )
  }

  getNombreMarca(marca_Id: number): string {
    const marca = this.marcas.find((m) => m.id === marca_Id);
    return marca ? marca.nombre : '-';
  }

  getNombreCarroceria(carroceria_Id: number): string {
    const carroceria = this.carrocerias.find((c) => c.id === carroceria_Id);
    return carroceria ? carroceria.nombre : '-';
  }

  getTipoCambio(cambio_Id: number): string {
    const cambio = this.cambios.find((c) => c.id === cambio_Id);
    return cambio ? cambio.tipo : '-';
  }

}
