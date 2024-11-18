import { Component, OnInit } from '@angular/core';
import { CarDataService } from '../../services/car-data.service';
import { Coche } from '../admin-page/modelo-coche';
import { AuthService } from '../../auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../../auth/usuario';

@Component({
  selector: 'app-appointment-page',
  templateUrl: './appointment-page.component.html',
  styleUrl: './appointment-page.component.css'
})
export class AppointmentPageComponent implements OnInit {

  usuario: Usuario | null = null;
  coche: Coche | null = null;
  formCrearCita: FormGroup;

  constructor(private carDataService: CarDataService, private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.formCrearCita = this.fb.group({
      nombre: [{ value: this.usuario?.nombre, disabled: true }],
      email: [{ value: this.usuario?.email, disabled: true }],
      coche: [{ value: this.coche?.id, disabled: true}],
      fechaHora: ['', Validators.required],
      mensaje: ['']
    });
  }

  ngOnInit() {
    this.coche = this.carDataService.getdatosCoche().coche;
    this.authService.usuario$.subscribe(usuario => {
      this.usuario = usuario;
    }

    )
  }

  enviarCita() {

  }

}
