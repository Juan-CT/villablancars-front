import { Component, OnInit } from '@angular/core';
import { GestUserService } from '../../../services/gest-user.service';
import { Cita } from '../modelo-cita';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.css'
})
export class CitasComponent implements OnInit{

  citas: Cita[] = [];


  constructor(private gestUserService: GestUserService) {

  }

  ngOnInit(): void {
    this.gestUserService.obtenerCitas().subscribe(
      (datos) => {
        this.citas = datos.citas;
      }
    );
  }
}
