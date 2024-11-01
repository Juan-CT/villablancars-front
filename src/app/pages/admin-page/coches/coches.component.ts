import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarServiceService } from '../../../services/car-service.service';
import { Cambio, Carroceria, Coche, CocheCreacion, Marca } from '../modelo-coche';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-coches',
  templateUrl: './coches.component.html',
  styleUrl: './coches.component.css'
})
export class CochesComponent implements OnInit {

  listarSelec: boolean = false;
  crearSelec: boolean = false;
  anios: number[] = [];

  marcas: Marca[] = [];
  carrocerias: Carroceria[] = [];
  coches: Coche[] = [];
  cambios: Cambio[] = [
    { id: 1, tipo: 'Automático' },
    { id: 2, tipo: 'Manual' }
  ];

  formCrearCoche: FormGroup;

  constructor(private fb: FormBuilder, private carService: CarServiceService) {
    const anioActual = new Date().getFullYear();

    this.formCrearCoche = this.fb.group({
      marca: ['', Validators.required],
      carroceria: ['', Validators.required],
      modelo: ['', Validators.required],
      anio: ['', [Validators.required, Validators.min(2000), Validators.max(anioActual)]],
      color: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      cambio: ['', [Validators.required]],
      kilometros: ['', [Validators.required, Validators.min(0), Validators.max(999999)]],
      autonomia: ['', [Validators.required, Validators.min(0), Validators.max(1500)]],
      potencia: ['', [Validators.required, Validators.min(0), Validators.max(2000)]],
      descripcion: ['', Validators.required]
    });

    const currentYear: number = new Date().getFullYear();
    for (let anio = 2000; anio <= currentYear; anio++) {
      this.anios.push(anio);
    }


  }

  ngOnInit(): void {
    this.carService.obtenerMarcasCarrocerias().subscribe(
      (datos) => {
        this.marcas = datos.marcas;
        this.carrocerias = datos.carrocerias;
      }, (error) => {
        console.error('Error al obtener los datos', error);
      }
    );
  }

  mostrarCrear() {
    this.crearSelec = true;
    this.listarSelec = false;
  }

  mostrarListar() {
    this.listarSelec = true;
    this.crearSelec = false;
    this.obtenerCochesExistentes();
  }

  editarCoche() {

  }

  eliminarcoche(coche_id: number) {
    Swal.fire({
      title: 'Eliminar Coche',
      text: '¿Está seguro de que quiere eliminar el coche seleccionado?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      background: '#fff',
      color: '#333',
      confirmButtonColor: '#25d366',
      cancelButtonColor: '#ff6b6b',
    }).then((result) => {
      if (result.isConfirmed) {
        this.carService.eliminarCoche(coche_id).subscribe(
          () =>{
            Swal.fire('Éxito', 'Coche eliminado correctamente.', 'success');
            this.obtenerCochesExistentes();
          },
          () => Swal.fire('Error', 'Ha surgido un error al eliminar el coche.', 'error')
        );
      }
    })
  }

  obtenerCochesExistentes() {
    this.carService.obtenerCoches().subscribe(
      (coches) => {
        this.coches = coches;
        console.log(coches);
      }, (error) => {
        console.error('Error al obtener los coches existentes', error);
      }
    )
  }

  guardarCoche() {
    const formValues = this.formCrearCoche.value;
    // Creación del coche para enviar al backend
    const datosCoche: CocheCreacion = {
      marca_id: Number(formValues.marca),
      carroceria_id: Number(formValues.carroceria),
      cambio_id: formValues.cambio === 'Automático' ? 1 : 2,
      modelo: formValues.modelo,
      anio: Number(formValues.anio),
      color: formValues.color,
      precio: formValues.precio,
      kilometros: formValues.kilometros,
      autonomia: formValues.autonomia,
      potencia: formValues.potencia,
      descripcion: formValues.descripcion
    };
    // Confirmación de envío
    Swal.fire({
      title: 'Confirmar cambios',
      html: `
        <strong>Marca:</strong> ${this.marcas.find(m => m.id === datosCoche.marca_id)?.nombre} <br>
        <strong>Carrocería:</strong> ${this.carrocerias.find(c => c.id === datosCoche.carroceria_id)?.nombre} <br>
        <strong>Modelo:</strong> ${formValues.modelo} <br>
        <strong>Año:</strong> ${formValues.anio} <br>
        <strong>Color:</strong> ${formValues.color} <br>
        <strong>Cambio:</strong> ${formValues.cambio} <br>
        <strong>Kilómetros:</strong> ${formValues.kilometros} Km <br>
        <strong>Autonomía:</strong> ${formValues.autonomia} Km <br>
        <strong>Potencia:</strong> ${formValues.potencia} CV <br>
        <strong>Precio:</strong> ${formValues.precio} Euros <br>
        <strong>Descripción:</strong> ${formValues.descripcion} <br>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      background: '#fff',
      color: '#333',
      confirmButtonColor: '#25d366',
      cancelButtonColor: '#ff6b6b',
    }).then((result) => {
      if (result.isConfirmed) {
        // Envío del coche al backend
        this.carService.crearCoche(datosCoche).subscribe(() => {
          Swal.fire('Éxito', 'El coche ha sido guardado correctamente.', 'success');
          this.resetForm();
        }, () => {
          Swal.fire('Error', 'Ocurrió un problema al guardar el coche.', 'error');
        }
        );
      }
    });
  }

  resetForm() {
    this.formCrearCoche.reset();
  }

  getNomberMarca(marca_Id: number): string {
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
