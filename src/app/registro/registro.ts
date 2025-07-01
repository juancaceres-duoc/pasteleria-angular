import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalLoginService } from '../services/modal-login';

/**
 * Componente Registro
 *
 * Permite a los usuarios registrarse creando una cuenta con sus datos personales.
 * Valida el formulario para asegurar que los campos estén completos, las contraseñas coincidan,
 * y que el usuario tenga una edad mínima requerida.
 *
 * Funcionalidades:
 * - Registro de nuevos usuarios con validación de datos.
 * - Verificación de que el nombre de usuario no esté repetido.
 * - Validación personalizada de contraseña fuerte.
 * - Validación de edad mínima de 13 años.
 * - Almacena los usuarios en localStorage con tipo 'usuario'.
 * - Muestra mensajes de éxito o error.
 */
@Component({
  selector: 'app-registro',
  standalone: true,
  templateUrl: './registro.html',
  styleUrls: ['./registro.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class Registro {

  /**
   * Formulario reactivo para el registro de nuevos usuarios.
   */
  registroForm = new FormGroup({
    usuario: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(18),
      this.contraseñaFuerteValidator()
    ]),
    password2: new FormControl('', Validators.required),
    direccion: new FormControl(''),
    fechaNacimiento: new FormControl('', [Validators.required, this.edadMinimaValidator(13)])
  }, { validators: this.contraseñasIgualesValidator() });

  /**
   * Mensaje de error que se muestra si hay problemas en el formulario.
   */
  error = '';

  /**
   * Mensaje de éxito que se muestra si el registro fue exitoso.
   */
  exito = '';

  constructor(private router: Router, private modalService: ModalLoginService) {
    this.registroForm.valueChanges.subscribe(() => {
      this.error = '';
    });
  }

  /**
   * Procesa el registro del usuario. Si el formulario es válido, guarda el nuevo usuario en localStorage.
   */
  registrar() {
    this.error = '';
    this.exito = '';

    if (this.registroForm.invalid) {
      this.error = 'Por favor completa todos los campos correctamente.';
      return;
    }

    const { usuario, email, password, direccion, fechaNacimiento } = this.registroForm.value;

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const existe = usuarios.find((u: any) => u.usuario === usuario);

    if (existe) {
      this.error = 'El nombre de usuario ya está registrado.';
      return;
    }

    const nuevoUsuario = { usuario, email, password, direccion, fechaNacimiento, tipo: 'usuario' };
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    this.exito = 'Usuario registrado exitosamente.';
    this.registroForm.reset();
  }

  /**
   * Limpia los campos del formulario y los mensajes de estado.
   */
  limpiarFormulario() {
    this.registroForm.reset();
    this.error = '';
    this.exito = '';
  }

  /**
   * Validador que verifica que la contraseña tenga al menos una mayúscula y un número.
   * @returns ValidationErrors si la contraseña es débil.
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
   * Validador que asegura que los campos 'password' y 'password2' coincidan.
   * @returns ValidationErrors si las contraseñas no son iguales.
   */
  private contraseñasIgualesValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const password2 = group.get('password2')?.value;
      return password === password2 ? null : { contraseñasNoCoinciden: true };
    };
  }

  /**
   * Validador que comprueba que el usuario tenga una edad mínima.
   * @param minEdad Edad mínima permitida.
   * @returns ValidationErrors si el usuario es menor que la edad mínima.
   */
  private edadMinimaValidator(minEdad: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fechaStr = control.value;
      if (!fechaStr) return null;
      const fecha = new Date(fechaStr);
      const hoy = new Date();
      const edad = hoy.getFullYear() - fecha.getFullYear();
      const m = hoy.getMonth() - fecha.getMonth();
      if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
        return edad - 1 >= minEdad ? null : { edadInsuficiente: true };
      }
      return edad >= minEdad ? null : { edadInsuficiente: true };
    };
  }
}