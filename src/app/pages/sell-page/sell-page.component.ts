import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sell-page',
  templateUrl: './sell-page.component.html',
  styleUrl: './sell-page.component.css'
})
export class SellPageComponent {

  formVenderCoche: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formVenderCoche = this.fb.group({
      marca: '',
      carroceria: '',
      modelo: '',
      anio: '',
      color: '',
      precio: '',
      cambio: '',
      kilometros: '',
      autonomia: '',
      potencia: '',
      descripcion: '',
    })
  }
}
