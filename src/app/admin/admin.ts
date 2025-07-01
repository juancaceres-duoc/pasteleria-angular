import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {

  usuarios: any[] = [];

  ngOnInit(): void {
    if (typeof window !== 'undefined' && localStorage) {
      const data = localStorage.getItem('usuarios');
      if (data) {
        this.usuarios = JSON.parse(data);
      }
    }
  }

  eliminarUsuario(usuario: string): void {
    if (!usuario) return;

    const user = this.usuarios.find(u => u.usuario === usuario);

    if (user?.usuario?.toLowerCase() === 'admin' || user?.tipo?.toLowerCase() === 'admin') {
      alert('No se puede eliminar al usuario admin');
      return;
    }

    this.usuarios = this.usuarios.filter(u => u.usuario !== usuario);

    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
    }
  }
}