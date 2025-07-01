import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Recuperar } from './recuperar';
import { Router } from '@angular/router';
import { ModalLoginService } from '../services/modal-login';

describe('Recuperar', () => {
  let component: Recuperar;
  let fixture: ComponentFixture<Recuperar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({      
      imports: [Recuperar, ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: { navigate: () => {} } },
        { provide: ModalLoginService, useValue: { triggerOpenLoginModal: () => {} } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Recuperar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería tener el formulario inválido con campos vacíos', () => {
    component.recuperarForm.setValue({
      email: '',
      password: '',
      password2: ''
    });
    expect(component.recuperarForm.invalid).toBeTrue();
  });

  it('debería mostrar error si las contraseñas no coinciden', () => {
    component.recuperarForm.setValue({
      email: 'correo@ejemplo.com',
      password: 'Abc123',
      password2: 'Dfg456'
    });
    component.recuperar();
    expect(component.error).toBe('Las contraseñas no coinciden.');
  });

  it('debería mostrar error si el email no existe en localStorage', () => {
    localStorage.setItem('usuarios', JSON.stringify([]));
    component.recuperarForm.setValue({
      email: 'correo@correo.com',
      password: 'Abc123',
      password2: 'Abc123'
    });
    component.recuperar();
    expect(component.error).toBe('No se encontró un usuario con ese correo electrónico.');
  });

  it('debería actualizar la contraseña correctamente', () => {
    const usuario = {
      usuario: 'prueba',
      email: 'prueba@correo.com',
      password: 'anterior',
      tipo: 'usuario'
    };
    localStorage.setItem('usuarios', JSON.stringify([usuario]));

    component.recuperarForm.setValue({
      email: 'prueba@correo.com',
      password: 'Nueva123',
      password2: 'Nueva123'
    });

    component.recuperar();
    expect(component.exito).toBe('Contraseña actualizada con éxito. Ahora puedes iniciar sesión.');

    const usuariosActualizados = JSON.parse(localStorage.getItem('usuarios')!);
    expect(usuariosActualizados[0].password).toBe('Nueva123');
  });
});