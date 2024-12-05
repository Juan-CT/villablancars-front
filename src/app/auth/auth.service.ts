import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User,
  onAuthStateChanged, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential,
} from '@angular/fire/auth';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { Usuario } from './usuario';
import { environment } from '../environments/environment';
import { sendEmailVerification, updateProfile } from 'firebase/auth';
import Swal from 'sweetalert2';
import { SwalService } from '../shared/swal.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  // userSubject se actualiza con los datos del usuario autenticado
  private userSubject: BehaviorSubject<Usuario | null> = new BehaviorSubject<Usuario | null>(null);
  // usuario$ es un Observable público que expone el estado del usuario autenticado,
  // permitiendo a otros components suscribirse y reaccionar a cambios
  public usuario$: Observable<Usuario | null> = this.userSubject.asObservable();

  constructor(private auth: Auth, private http: HttpClient, private swalService: SwalService) {
    // Se dispara si hay un cambio en la autenticación
    // También detecta al usuario autenticado y y guarda en userSubject
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        const response = await firstValueFrom(this.verificarToken(token));

        if (response && response.rol) {
          const usuario: Usuario = {
            idFirebase: user.uid,
            nombre: user.displayName || '',
            email: user.email || '',
            emailVerificado: user.emailVerified,
            rol: response.rol || 'usuario'
          };

          this.userSubject.next(usuario);
        } else {
          console.error('Error al obtener los datos del usuario');
          this.userSubject.next(null);
        }
      } else {
        this.userSubject.next(null);
      }
    });
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const credencialesUsuario = await signInWithEmailAndPassword(this.auth, email, password);

      if (!credencialesUsuario.user.emailVerified) {
        this.swalService.mostrarMensajeHtml(
          'Correo no verificado',
          'Por favor, verifica tu correo electrónico antes de iniciar sesión. <br> Si no has recibido el correo, <a href="#" id="reenv-verif">haz clic aquí</a> para reenviarlo.',
          'info',
          () => {
            const reenviarLink = document.getElementById('reenv-verif');

            if (reenviarLink) {
              reenviarLink.addEventListener('click', async (event) => {
                event.preventDefault();

                try {
                  await sendEmailVerification(credencialesUsuario.user);
                  this.swalService.updateMensaje(
                    'Hemos enviado nuevamente el correo de verificación. Por favor, revisa tu bandeja de entrada.', 'success');
                } catch (error) {
                  this.swalService.updateMensaje(
                    'Hubo un problema al reenviar el correo de verificación. Inténtalo de nuevo más tarde.', 'error');
                }
              });
            }
          }
        );
        return;
      }

      const token = await credencialesUsuario.user.getIdToken();
      const response = await firstValueFrom(this.verificarToken(token));

      if (response.error) {
        this.swalService.mostrarMensajeText('Error de autenticación', response.message, 'error');
        return;
      }

      const usuario: Usuario = {
        idFirebase: credencialesUsuario.user.uid,
        nombre: credencialesUsuario.user.displayName || '',
        email: credencialesUsuario.user.email || '',
        emailVerificado: credencialesUsuario.user.emailVerified,
        rol: response.rol || 'usuario'
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
      await updateProfile(credencialesUsuario.user, { displayName: nombre });
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

  async cambiarEmail(nuevoEmail: string): Promise<void> {
    const usuario = this.auth.currentUser!;

    const password = await this.pedirPassword();

    if (!this.validarPassword(password)) {
      return;
    }

    try {
      await this.reautenticar(usuario, password);

      await updateEmail(usuario, nuevoEmail);
      await sendEmailVerification(usuario);

      const token = await usuario.getIdToken();
      const response = await firstValueFrom(this.verificarToken(token));

      if (response && response.rol) {
        const usuarioActualizado: Usuario = {
          idFirebase: usuario.uid,
          nombre: usuario.displayName || '',
          email: nuevoEmail,
          emailVerificado: usuario.emailVerified,
          rol: response.rol || 'usuario'
        };
        this.userSubject.next(usuarioActualizado);
      }

      this.http.post(`${environment.apiURL}/actualizar-correo`, {
        idFirebase: usuario.uid,
        email: nuevoEmail,
        _method: 'PUT'
      }, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }).subscribe(
        () =>
          this.swalService.mostrarMensajeText(
            'Correo electrónico actualizado', 'Tu correo electrónico ha sido actualizado correctamente. Valida la nueva dirección en tu bandeja personal', 'success'
          ),
        error => console.log('Error al hacer la solicitud:', error)
      );
    } catch {
      this.swalService.mostrarMensajeText('Error', 'Hubo un problema al actualizar tu correo electrónico. Inténtalo de nuevo más tarde.', 'error');
    }
  }

  async cambiarPassword(nuevaPassword: string): Promise<void> {
    const usuario = this.auth.currentUser!;
    const password = await this.pedirPassword();

    if (!this.validarPassword(password)) {
      return;
    }

    try {
      await this.reautenticar(usuario, password);
      await updatePassword(usuario, nuevaPassword);
      this.swalService.mostrarMensajeText('Contraseña actualizado', 'Tu Contraseña ha sido actualizado correctamente.', 'success');
    } catch {
      this.swalService.mostrarMensajeText('Error', 'Hubo un problema al actualizar tu contraseña. Inténtalo de nuevo más tarde.', 'error');
    }
  }

  async pedirPassword(): Promise<string> {
    const { value: password } = await Swal.fire({
      title: 'Introduce tu contraseña',
      input: 'password',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      inputPlaceholder: 'Introduce tu contraseña',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      background: '#fff',
      color: '#333',
      confirmButtonColor: '#25d366',
      cancelButtonColor: '#ff6b6b',
      showLoaderOnConfirm: true,
      preConfirm: (password) => {
        if (!password || password.trim() === '') {
          Swal.showValidationMessage('Por favor, introduce una contraseña');
        } else {
          return password;
        }
      }
    });

    return password || null;
  }

  validarPassword(password: string): boolean {
    const passwordPatron = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordPatron.test(password)) {
      this.swalService.mostrarMensajeText('Error', 'El formato de la contraseña no es el correcto.', 'error');
      return false;
    }
    return true;
  }

  async reautenticar(usuario: any, password: string): Promise<void> {
    const credencial = EmailAuthProvider.credential(usuario.email!, password);
    await reauthenticateWithCredential(usuario, credencial);
  }

}
