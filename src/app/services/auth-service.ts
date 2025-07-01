import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private sesionSubject = new BehaviorSubject<any>(this.getSesion());
  sesion$ = this.sesionSubject.asObservable();

  constructor() {
    if (typeof localStorage !== 'undefined') {      
      const usuariosStr = localStorage.getItem('usuarios');
      if (!usuariosStr) {
        const admin = {
          usuario: 'admin',
          email: 'admin@dessertico.cl',
          password: 'Admin123',
          tipo: 'admin'
        };
        localStorage.setItem('usuarios', JSON.stringify([admin]));
      }
    }
  }

  getSesion() {
    if (typeof localStorage === 'undefined') return null;
    const sesion = localStorage.getItem('sesion');
    return sesion ? JSON.parse(sesion) : null;
  }

  estaLogueado(): boolean {
    const sesion = this.getSesion();
    return !!sesion?.logueado;
  }

  esAdmin(): boolean {
    const sesion = this.getSesion();
    return sesion?.tipo === 'admin';
  }

  cerrarSesion(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem('sesion');
    this.sesionSubject.next(null);
  }

  iniciarSesion(usuario: string, password: string): boolean {
    if (typeof localStorage === 'undefined') return false;
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const user = usuarios.find((u: any) => u.usuario === usuario && u.password === password);

    if (user) {
      localStorage.setItem('sesion', JSON.stringify({
        logueado: true,
        usuario: user.usuario,
        tipo: user.tipo || 'usuario'
      }));
      this.sesionSubject.next(this.getSesion());
      return true;
    }
    return false;
  }

  addUser(user: any): boolean {
    if (typeof localStorage === 'undefined') return false;
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const existe = usuarios.some((u: any) => u.usuario === user.usuario);
    if (existe) return false;

    usuarios.push(user);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    return true;
  }
}