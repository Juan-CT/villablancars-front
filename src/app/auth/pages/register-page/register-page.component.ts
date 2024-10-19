import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {

  @Output() aLogin = new EventEmitter<void>();

  constructor(private authService: AuthService) {}

  irALogin() {
    this.aLogin.emit();
  }

}
