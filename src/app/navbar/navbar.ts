import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalLoginService } from '../services/modal-login';
import { AuthService } from '../services/auth-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Componente Navbar
 *
 * Muestra la barra de navegación principal del sitio.
 * Gestiona el estado de sesión del usuario y permite abrir el modal de login o cerrar sesión.
 *
 * Funcionalidades:
 * - Mostrar enlaces condicionales según tipo de usuario (por ejemplo, admin).
 * - Mostrar botón de login o logout según el estado de autenticación.
 * - Abrir el modal de login desde un servicio centralizado.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {

  /**
   * Contiene los datos de sesión del usuario actual.
   * Se actualiza automáticamente mediante suscripción al observable del AuthService.
   */
  sesion: any = null;

  /**
   * Constructor del componente.
   *
   * @param modalService Servicio que controla la apertura del modal de login.
   * @param authService Servicio de autenticación para obtener/cerrar sesión.
   * @param router Servicio de navegación para redirigir tras logout.
   */
  constructor(
    private modalService: ModalLoginService,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Se suscribe al observable de sesión para mantener el estado actualizado.
   */
  ngOnInit(): void {
    this.authService.sesion$.subscribe(sesion => {
      this.sesion = sesion;
    });
  }

  /**
   * Abre el modal de login al hacer clic en el botón correspondiente.
   */
  onLoginClick() {
    this.modalService.triggerOpenLoginModal();
  }

  /**
   * Cierra la sesión del usuario actual y redirige a la página principal.
   */
  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigate(['/']);
  }
}