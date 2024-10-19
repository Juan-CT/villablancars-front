import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(private auth: Auth) {
    this.auth.onAuthStateChanged(user => {
      this.userSubject.next(user);
    });
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const credencialesUsuario = await signInWithEmailAndPassword(this.auth, email, password);
      console.log("Logueado", credencialesUsuario.user);
      this.userSubject.next(credencialesUsuario.user);
    } catch (error){
      console.error("Error al iniciar sesión", error);
    }
  }

  async registro(email: string, password: string): Promise<void> {
    try {
      const credencialesUsuario = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log("Registrado", credencialesUsuario.user);
      this.userSubject.next(credencialesUsuario.user);
    } catch (error){
      console.error("Error al registrarse", error);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.userSubject.next(null); // Limpia el estado del usuario
      console.log('Desconectado');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  getUsuarioActual(): User | null {
    return this.auth.currentUser;
  }


}
