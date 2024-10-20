import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth , signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, onAuthStateChanged } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from './usuario';
import { environment } from '../environments/environment';
import { sendEmailVerification } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(private auth: Auth , private http: HttpClient) {
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    });
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const credencialesUsuario = await signInWithEmailAndPassword(this.auth, email, password);

      if (!credencialesUsuario.user.emailVerified) {
        alert('Por favor, verifica tu email antes de iniciar sesión');
        throw new Error("Email no verificado");
      }

      console.log("Logueado", credencialesUsuario.user);
      this.userSubject.next(credencialesUsuario.user);
    } catch (error){
      console.error("Error al iniciar sesión", error);
    }
  }

  async registro(email: string, password: string): Promise<User | null> {
    try {
      const credencialesUsuario = await createUserWithEmailAndPassword(this.auth, email, password);
      await sendEmailVerification(credencialesUsuario.user);
      return credencialesUsuario.user;
    } catch (error) {
      console.error("Error al registrar usuario", error);
      return null;
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.userSubject.next(null);
  }

  guardarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${environment.apiURL}/guardarUsuario`, usuario);
  }

}
