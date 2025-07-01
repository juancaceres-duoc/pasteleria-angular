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

@Component({
  selector: 'app-recuperar',
  standalone: true,
  templateUrl: './recuperar.html',
  styleUrls: ['./recuperar.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class Recuperar {
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

  error = '';
  exito = '';

  constructor(private router: Router, private modalService: ModalLoginService) {
    this.recuperarForm.valueChanges.subscribe(() => {
      this.error = '';
    });
  }

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

  limpiarFormulario() {
    this.recuperarForm.reset();
    this.error = '';
    this.exito = '';
  }

  private contraseñaFuerteValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const tieneNumero = /\d/.test(value);
      const tieneMayuscula = /[A-Z]/.test(value);
      return tieneNumero && tieneMayuscula ? null : { contraseñaDebil: true };
    };
  }

  private passwordsIgualesValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const password2 = group.get('password2')?.value;
      return password === password2 ? null : { contraseñasNoCoinciden: true };
    };
  }
}