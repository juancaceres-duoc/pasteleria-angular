import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Registro } from './registro';
import { Router } from '@angular/router';
import { ModalLoginService } from '../services/modal-login';

describe('Registro', () => {
  let component: Registro;
  let fixture: ComponentFixture<Registro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({      
      imports: [Registro, ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: { navigate: () => {} } },
        { provide: ModalLoginService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Registro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería tener el formulario inválido con campos vacíos', () => {
    component.registroForm.setValue({
      usuario: '',
      email: '',
      password: '',
      password2: '',
      direccion: '',
      fechaNacimiento: ''
    });
    expect(component.registroForm.invalid).toBeTrue();
  });

  it('debería tener el formulario válido con datos válidos', () => {
    component.registroForm.setValue({
      usuario: 'juan123',
      email: 'juan@mail.com',
      password: 'Abc123',
      password2: 'Abc123',
      direccion: '',
      fechaNacimiento: '2000-01-01'
    });
    expect(component.registroForm.valid).toBeTrue();
  });

  it('debería mostrar error si las contraseñas no coinciden', () => {
    component.registroForm.setValue({
      usuario: 'juan123',
      email: 'juan@mail.com',
      password: 'Abc123',
      password2: 'Dfg456',
      direccion: '',
      fechaNacimiento: '2000-01-01'
    });
    component.registrar();
    expect(component.error).toBe('Por favor completa todos los campos correctamente.');
  });

  it('debería registrar un usuario nuevo correctamente', () => {
    localStorage.setItem('usuarios', JSON.stringify([]));

    component.registroForm.setValue({
      usuario: 'nuevo',
      email: 'nuevo@correo.com',
      password: 'Abc123',
      password2: 'Abc123',
      direccion: '',
      fechaNacimiento: '2000-01-01'
    });

    component.registrar();
    expect(component.exito).toBe('Usuario registrado exitosamente.');
  });
});
