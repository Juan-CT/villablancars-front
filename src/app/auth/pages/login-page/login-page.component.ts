import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})

export class LoginPageComponent {

  @Output() aRegistro = new EventEmitter<void>();

  constructor(private authService: AuthService) { }


  irARegistro() {
    this.aRegistro.emit();
  }



}
