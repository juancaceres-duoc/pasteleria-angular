import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Router } from '@angular/router';
import { ModalLoginService } from '../services/modal-login';

/**
 * Componente Recuperar
 *
 * Permite a los usuarios restablecer su contraseña utilizando su correo electrónico.
 * Al enviar un formulario válido, busca al usuario en el localStorage y actualiza su contraseña.
 *
 * Funcionalidades:
 * - Valida el formulario de recuperación con email y nuevas contraseñas.
 * - Verifica que las contraseñas ingresadas coincidan.
 * - Reemplaza la contraseña del usuario si existe en localStorage.
 * - Muestra mensajes de éxito o error según el resultado.
 * - Redirige automáticamente al inicio y abre el modal de login tras éxito.
 */
@Component({
  selector: 'app-recuperar',
  standalone: true,
  templateUrl: './recuperar.html',
  styleUrls: ['./recuperar.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class Recuperar {
  /**
   * Formulario reactivo para ingresar email y nueva contraseña.
   */
  recuperarForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(18),
      this.contraseñaFuerteValidator()
    ]),
    password2: new FormControl('', Validators.required),
  }, { validators: this.passwordsIgualesValidator() });

  /**
   * Mensaje de error que se muestra al usuario.
   */
  error = '';

  /**
   * Mensaje de éxito que se muestra al usuario.
   */
  exito = '';

  constructor(private router: Router, private modalService: ModalLoginService) {
    this.recuperarForm.valueChanges.subscribe(() => {
      this.error = '';
    });
  }

  /**
   * Procesa el formulario de recuperación. Si el email existe, actualiza la contraseña.
   */
  recuperar() {
    this.error = '';
    this.exito = '';

    if (this.recuperarForm.invalid) {
      if (this.recuperarForm.errors?.['contraseñasNoCoinciden']) {
        this.error = 'Las contraseñas no coinciden.';
      } else {
        this.error = 'Por favor completa todos los campos correctamente.';
      }
      return;
    }

    const { email, password } = this.recuperarForm.value!;
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find((u: any) => u.email === email);

    if (!usuario) {
      this.error = 'No se encontró un usuario con ese correo electrónico.';
      return;
    }

    usuario.password = password;
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    this.exito = 'Contraseña actualizada con éxito. Ahora puedes iniciar sesión.';
    this.recuperarForm.reset();

    setTimeout(() => {
      this.router.navigate(['/']).then(() => {
        this.modalService.triggerOpenLoginModal();
      });
    }, 2000);
  }

  /**
   * Limpia los mensajes y resetea el formulario.
   */
  limpiarFormulario() {
    this.recuperarForm.reset();
    this.error = '';
    this.exito = '';
  }

  /**
   * Validador personalizado que exige al menos una mayúscula y un número.
   * @returns ValidationErrors o null
   */
  private contraseñaFuerteValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const tieneNumero = /\d/.test(value);
      const tieneMayuscula = /[A-Z]/.test(value);
      return tieneNumero && tieneMayuscula ? null : { contraseñaDebil: true };
    };
  }

  /**
   * Validador que verifica que los campos `password` y `password2` sean iguales.
   * @returns ValidationErrors o null
   */
  private passwordsIgualesValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const password2 = group.get('password2')?.value;
      return password === password2 ? null : { contraseñasNoCoinciden: true };
    };
  }
}