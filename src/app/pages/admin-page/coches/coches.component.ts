import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarServiceService } from '../../../services/car-service.service';
import { Carroceria, Marca } from '../modelo-coche';

@Component({
  selector: 'app-coches',
  templateUrl: './coches.component.html',
  styleUrl: './coches.component.css'
})
export class CochesComponent implements OnInit {

  listarSelec: boolean = false;
  crearSelec: boolean = false;

  marcas: Marca[] = [];
  carrocerias: Carroceria[] = [];

  formCrearCoche: FormGroup;

  constructor(private fb: FormBuilder, private carService: CarServiceService) {
    this.formCrearCoche = this.fb.group({
      marca: ['', Validators.required],
      carroceria: ['', Validators.required],
      modelo: ['', Validators.required],
      anio: ['', [Validators.required, Validators.min(2000)], Validators.max(2024)],
      color: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      kilometros: ['', [Validators.required, Validators.min(0)]],
      cilindrada: ['', [Validators.required, Validators.min(0)]],
      potencia: ['', [Validators.required, Validators.min(0)]],
      descripcion: ['', Validators.required]
    });

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

  mostrarListar(){
    this.listarSelec = true;
    this.crearSelec = false;
  }

  guardarCoche(){

  }
}
