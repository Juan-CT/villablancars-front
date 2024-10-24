import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, onAuthStateChanged } from '@angular/fire/auth';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { Usuario } from './usuario';
import { environment } from '../environments/environment';
import { sendEmailVerification, updateProfile } from 'firebase/auth';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private userSubject: BehaviorSubject<Usuario | null> = new BehaviorSubject<Usuario | null>(null);
  public usuario$: Observable<Usuario | null> = this.userSubject.asObservable();

  constructor(private auth: Auth, private http: HttpClient) {
    onAuthStateChanged(this.auth, (user) => {

      if (user) {
        const usuario: Usuario = {
          idFirebase: user.uid,
          nombre: user.displayName || '',
          email: user.email || '',
          emailVerificado: user.emailVerified
        };

        this.userSubject.next(usuario);
      } else {
        this.userSubject.next(null);
      }
    });
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const credencialesUsuario = await signInWithEmailAndPassword(this.auth, email, password);

      if (!credencialesUsuario.user.emailVerified) {
        Swal.fire({
          title: 'Correo no verificado',
          html: 'Por favor, verifica tu correo electrónico antes de iniciar sesión. <br> Si no has recibido el correo, <a href="#" id="reenv-verif">haz clic aquí</a> para reenviarlo.',
          icon: 'info',
          confirmButtonText: 'Aceptar',
          background: '#fff',
          color: '#333',
          confirmButtonColor: '#25d366',
          customClass: {
            popup: 'swal'
          },
          didRender: () => {
            const reenviarLink = document.getElementById('reenv-verif');

            if (reenviarLink) {
              reenviarLink.addEventListener('click', async (event) => {
                event.preventDefault();

                try {
                  await sendEmailVerification(credencialesUsuario.user);
                  Swal.update({
                    html: 'Hemos enviado nuevamente el correo de verificación. Por favor, revisa tu bandeja de entrada.',
                  });
                } catch (error) {
                  Swal.update({
                    html: 'Hubo un problema al reenviar el correo de verificación. Inténtalo de nuevo más tarde.',
                    icon: 'error'
                  });
                }
              });
            }
          }
        });

        return;
      }

      const token = await credencialesUsuario.user.getIdToken();
      const response = await firstValueFrom(this.verificarToken(token));

      if (response.error) {
        Swal.fire({
          title: 'Error de autenticación',
          text: response.message,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          background: '#fff',
          color: '#333',
          confirmButtonColor: '#25d366',
          customClass: {
            popup: 'swal'
          }
        });
        return;
      }

      const usuario: Usuario = {
        idFirebase: credencialesUsuario.user.uid,
        nombre: credencialesUsuario.user.displayName || '',
        email: credencialesUsuario.user.email || '',
        emailVerificado: credencialesUsuario.user.emailVerified
      }
      this.userSubject.next(usuario);

    } catch (error) {
      console.error("Error al iniciar sesión", error);
      throw error;
    }
  }

  async registro(nombre: string, email: string, password: string): Promise<User | null> {
    try {
      const credencialesUsuario = await createUserWithEmailAndPassword(this.auth, email, password);
      await updateProfile(credencialesUsuario.user, {displayName: nombre});
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

  verificarEmail(email: string): Observable<any> {
    return this.http.post(`${environment.apiURL}/verificar-email`, { email });
  }

  verificarToken(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${environment.apiURL}/verificar-token`, { headers });
  }

}
