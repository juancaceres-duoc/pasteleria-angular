import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class Perfil implements OnInit {

  editarPerfilForm = new FormGroup({
    usuario: new FormControl({ value: '', disabled: true }, Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(18),
      this.contraseñaFuerteValidator()
    ]),
    direccion: new FormControl(''),
    fechaNacimiento: new FormControl('', Validators.required),
    tipo: new FormControl({ value: '', disabled: true }, Validators.required)
  });

  mensaje = '';
  error = '';
  usuarios: any[] = [];
  usuarioOriginal = '';

  ngOnInit() {
    const sesionStr = localStorage.getItem('sesion');
    const sesion = sesionStr ? JSON.parse(sesionStr) : null;

    const usuariosStr = localStorage.getItem('usuarios');
    this.usuarios = usuariosStr ? JSON.parse(usuariosStr) : [];

    const usuarioEncontrado = this.usuarios.find(u => u.usuario === sesion?.usuario);

    if (usuarioEncontrado) {
      this.usuarioOriginal = usuarioEncontrado.usuario;
      this.editarPerfilForm.patchValue({
        usuario: usuarioEncontrado.usuario,
        email: usuarioEncontrado.email,
        password: usuarioEncontrado.password,
        direccion: usuarioEncontrado.direccion || '',
        fechaNacimiento: usuarioEncontrado.fechaNacimiento || '',
        tipo: usuarioEncontrado.tipo
      });
    }
  }

  editarPerfil() {
    if (this.editarPerfilForm.invalid) {
      this.error = 'Por favor completa todos los campos correctamente.';
      this.mensaje = '';
      return;
    }

    this.error = '';
    const datosActualizados = this.editarPerfilForm.getRawValue();
    const index = this.usuarios.findIndex(u => u.usuario === this.usuarioOriginal);

    if (index !== -1) {
      this.usuarios[index] = { ...this.usuarios[index], ...datosActualizados };
      localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
      localStorage.setItem('sesion', JSON.stringify({ ...this.usuarios[index], logueado: true }));
      this.mensaje = 'Perfil actualizado exitosamente.';
    }
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
}