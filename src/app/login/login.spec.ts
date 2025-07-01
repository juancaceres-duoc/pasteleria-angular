import 'zone.js';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({      
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: { navigate: () => {}, url: ''} },        
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería tener el formulario inválido con campos vacíos', () => {
    component.loginForm.setValue({ usuario: '', password: '' });
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('debería tener el formulario válido con datos válidos', () => {
    component.loginForm.setValue({ usuario: 'admin', password: 'Admin123' });
    expect(component.loginForm.valid).toBeTrue();
  });

  it('debería mostrar mensaje de error si las credenciales no coinciden', () => {
    component.loginForm.setValue({ usuario: 'desconocido', password: '123456' });
    component.login();
    expect(component.error).toBe('Usuario o contraseña incorrectos');
  });
});