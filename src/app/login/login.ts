import { Component, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ModalLoginService } from '../services/modal-login';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';

/**
 * Componente Login
 *
 * Muestra un formulario de inicio de sesión dentro de un modal.
 * Se activa desde otros componentes mediante el servicio ModalLoginService.
 * Verifica las credenciales usando el AuthService y redirige
 * al panel de administrador o página principal según el tipo de usuario.
 *
 * También ofrece navegación hacia el registro de usuario y recuperación de contraseña.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent implements OnDestroy {

  /** Formulario reactivo para capturar usuario y contraseña */
  loginForm = new FormGroup({
    usuario: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  /** Mensaje de error mostrado al usuario en caso de fallo */
  error: string = '';

  /** Referencia al modal HTML del login */
  @ViewChild('loginModal', { static: true }) loginModal!: TemplateRef<any>;

  /** Suscripción al evento de apertura del modal */
  private subscription: Subscription;

  constructor(
    private modalService: NgbModal,
    private modalTrigger: ModalLoginService,
    private AuthService: AuthService,
    private route: Router
  ) {
    // Suscribirse a evento para abrir el modal desde otro componente
    this.subscription = this.modalTrigger.openLoginModal$.subscribe(() => this.openModal());

    // Limpiar errores al modificar el formulario
    this.loginForm.valueChanges.subscribe(() => {
      this.error = '';
    });
  }

  /** Abre el modal de login */
  openModal() {
    this.error = '';
    this.modalService.open(this.loginModal, { size: 'lg', centered: true, backdrop: 'static' });
  }

  /** Ejecuta la lógica de login y validación de credenciales */
  login() {
    this.error = '';

    if (this.loginForm.invalid) {
      this.error = 'Todos los campos son obligatorios';
      return;
    }

    const { usuario, password } = this.loginForm.value;
    const success = this.AuthService.iniciarSesion(usuario!, password!);

    if (success) {
      this.error = '';
      this.modalService.dismissAll();
      const sesion = this.AuthService.getSesion();
      window.location.href = '/';
    } else {
      this.error = 'Usuario o contraseña incorrectos';
    }
  }

  /** Cierra el modal y redirige a la vista de registro */
  irARegistro() {
    this.modalService.dismissAll();
    this.route.navigate(['/registro']);
  }

  /** Cierra el modal y redirige a la vista de recuperación de contraseña */
  irARecuperar() {
    this.modalService.dismissAll();
    this.route.navigate(['/recuperar']);
  }

  /** Cancela la suscripción al evento de apertura del modal */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}