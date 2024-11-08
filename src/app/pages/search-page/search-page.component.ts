import { Component, OnInit } from '@angular/core';
import { Cambio, Carroceria, Coche, Marca } from '../admin-page/modelo-coche';
import { CarServiceService } from '../../services/car-service.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})

export class SearchPageComponent implements OnInit {

  marcas: Marca[] = [];
  carrocerias: Carroceria[] = [];
  coches: Coche[] = [];
  cochesFiltrados: Coche[] = [];
  cambios: Cambio[] = [
    { id: 1, tipo: 'Automático' },
    { id: 2, tipo: 'Manual' }
  ];
  opcionesOrdenamiento = [
    { id: 'precio-asc', label: 'Precio: Menor a Mayor' },
    { id: 'precio-desc', label: 'Precio: Mayor a Menor' },
    { id: 'autonomia-asc', label: 'Autonomia: Menor a Mayor' },
    { id: 'autonomia-desc', label: 'Autonomia: Mayor a Menor' },
    { id: 'anio-asc', label: 'Año: Antiguos primero' },
    { id: 'anio-desc', label: 'Año: Nuevos primero' },
    { id: 'km-asc', label: 'Menos kilómetros' },
    { id: 'km-desc', label: 'Más kilómetros' },
  ];
  textoBuscar: string = '';

  modalVisible: boolean = false;
  mostrarCambios: boolean = false;
  mostrarCarrocerias: boolean = false;
  mostrarMarcas: boolean = false;

  constructor(private carService: CarServiceService) { }

  ngOnInit(): void {
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
        this.cochesFiltrados = coches;
      }, (error) => {
        console.error('Error al obtener los coches existentes', error);
      }
    )
  }

  filtrarCochesModelo(): void {
    const busqueda = this.textoBuscar.toLowerCase().trim();
    this.cochesFiltrados = this.coches.filter(coche =>
      coche.modelo.toLowerCase().includes(busqueda)
    );
  }

  modalFiltros(): void {
    this.modalVisible = !this.modalVisible;
  }

  desplegarFiltros(filtro: string): void {
    if (filtro === 'cambios') this.mostrarCambios = !this.mostrarCambios;
    if (filtro === 'carrocerias') this.mostrarCarrocerias = !this.mostrarCarrocerias;
    if (filtro === 'marcas') this.mostrarMarcas = !this.mostrarMarcas;
  }

  aplicarFiltro(filtro: any, event: Event){
    const idBoton: string = (event.target as HTMLButtonElement).id;

    if (idBoton === 'cambio') {
      this.cochesFiltrados = this.coches.filter(coche => coche.cambio_id === filtro.id);
      this.mostrarCambios = !this.mostrarCambios;
    }

    if (idBoton === 'carroceria') {
      this.cochesFiltrados = this.coches.filter(coche => coche.carroceria_id === filtro.id);
      this.mostrarCarrocerias = !this.mostrarCarrocerias;
    }

    if (idBoton === 'marca') {
      this.cochesFiltrados = this.coches.filter(coche => coche.marca_id === filtro.id);
      this.mostrarMarcas = !this.mostrarMarcas;
    }
    this.modalFiltros();
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

  ordenarCoches(criterio: string): void {
    switch (criterio) {
      case 'precio-asc':
        this.cochesFiltrados.sort((a, b) => a.precio - b.precio);
        break;
      case 'precio-desc':
        this.cochesFiltrados.sort((a, b) => b.precio - a.precio);
        break;
      case 'autonomia-asc':
        this.cochesFiltrados.sort((a, b) => a.autonomia - b.autonomia);
        break;
      case 'autonomia-desc':
        this.cochesFiltrados.sort((a, b) => b.autonomia - a.autonomia);
        break;
      case 'anio-asc':
        this.cochesFiltrados.sort((a, b) => a.anio - b.anio);
        break;
      case 'anio-desc':
        this.cochesFiltrados.sort((a, b) => b.anio - a.anio);
        break;
      case 'km-asc':
        this.cochesFiltrados.sort((a, b) => a.kilometros - b.kilometros);
        break;
      case 'km-desc':
        this.cochesFiltrados.sort((a, b) => b.kilometros - a.kilometros);
        break;
      default:
        break;
    }
  }

}
