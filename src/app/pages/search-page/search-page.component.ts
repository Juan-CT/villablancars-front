import { Component, OnInit } from '@angular/core';
import { Cambio, Carroceria, Coche, Marca } from '../admin-page/modelo-coche';
import { CarServiceService } from '../../services/car-service.service';

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
  filtrosActivos: { [key: string]: any } = {};
  filtroCambioActivo: any = null;
  filtroMarcaActivo: any = null;
  filtroCarroceriaActivo: any = null;
  modalVisible: boolean = false;
  mostrarCambios: boolean = false;
  mostrarCarrocerias: boolean = false;
  mostrarMarcas: boolean = false;

  pagActual: number = 1;
  itemsPorPag: number = 10;
  totalCoches: number = 0;
  totalPag: number = 1;

  constructor(private carService: CarServiceService) { }

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

    this.carService.obtenerCoches().subscribe(
      (coches) => {
        this.coches = coches;
        this.totalCoches = coches.length;
        this.totalPag = Math.ceil(this.totalCoches / this.itemsPorPag);
        this.filtrarCoches();
      }, (error) => {
        console.error('Error al obtener los coches existentes', error);
      }
    )
  }

  modalFiltros(): void {
    this.modalVisible = !this.modalVisible;
  }

  desplegarFiltros(filtro: string): void {
    if (filtro === 'cambios') {
      this.mostrarCambios = !this.mostrarCambios;
    }
    if (filtro === 'carrocerias') {
      this.mostrarCarrocerias = !this.mostrarCarrocerias;
    }
    if (filtro === 'marcas') {
      this.mostrarMarcas = !this.mostrarMarcas;
    }
    if (filtro === 'reset') {
      this.cochesFiltrados = this.coches;
      this.mostrarCarrocerias = false;
      this.mostrarMarcas = false;
      this.mostrarCambios = false;
      this.filtroMarcaActivo = null;
      this.filtroCarroceriaActivo = null;
      this.filtroCambioActivo = null;
      this.filtrosActivos = {};

      this.pagActual = 1;
      this.totalCoches = this.coches.length;
      this.totalPag = Math.ceil(this.totalCoches / this.itemsPorPag);
      this.filtrarCoches();

      this.modalFiltros();
    }

  }

  aplicarFiltro(filtro: any, event: Event) {
    const idBoton: string = (event.target as HTMLButtonElement).id;
    this.pagActual = 1;
    if (idBoton === 'cambio') {
      this.filtroCambioActivo = this.filtroCambioActivo && this.filtroCambioActivo.id === filtro.id ? null : filtro;
    } else if (idBoton === 'marca') {
      this.filtroMarcaActivo = this.filtroMarcaActivo && this.filtroMarcaActivo.id === filtro.id ? null : filtro;
    } else if (idBoton === 'carroceria') {
      this.filtroCarroceriaActivo = this.filtroCarroceriaActivo && this.filtroCarroceriaActivo.id === filtro.id ? null : filtro;
    }

    this.filtrosActivos[idBoton] = this.filtrosActivos[idBoton] && this.filtrosActivos[idBoton].id === filtro.id ? null : filtro;
    this.filtrarCoches();

    this.modalFiltros();
  }

  filtrarCoches(): void {
    let cochesFiltrados = [...this.coches];

    if (this.filtrosActivos['marca']) {
      cochesFiltrados = cochesFiltrados.filter(coche => coche.marca_id === this.filtrosActivos['marca'].id);
    }
    if (this.filtrosActivos['cambio']) {
      cochesFiltrados = cochesFiltrados.filter(coche => coche.cambio_id === this.filtrosActivos['cambio'].id);
    }
    if (this.filtrosActivos['carroceria']) {
      cochesFiltrados = cochesFiltrados.filter(coche => coche.carroceria_id === this.filtrosActivos['carroceria'].id);
    }

    const busqueda = this.textoBuscar.toLowerCase().trim();
    if (busqueda) {
      cochesFiltrados = cochesFiltrados.filter(coche => {
        const nombreMarca = this.getNombreMarca(coche.marca_id).toLowerCase();
        const modelo = coche.modelo.toLowerCase();
        return `${nombreMarca} ${modelo}`.includes(busqueda);
      });
    }

    this.totalCoches = cochesFiltrados.length;
    this.totalPag = Math.ceil(this.totalCoches / this.itemsPorPag);

    const inicioIndex = (this.pagActual - 1) * this.itemsPorPag;

    this.cochesFiltrados = cochesFiltrados.slice(inicioIndex, inicioIndex + this.itemsPorPag);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPag) {
      this.pagActual = pagina;
      this.filtrarCoches();

      window.scrollTo({
        top: 100,
        behavior: 'smooth'
      });
    }
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

  hayFiltrosActivos(): boolean {
    return Object.values(this.filtrosActivos).some((activo) => activo) ||
      !!this.filtroMarcaActivo || !!this.filtroCarroceriaActivo || !!this.filtroCambioActivo;
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
