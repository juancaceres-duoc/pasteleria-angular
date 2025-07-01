import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Perfil } from './perfil';

describe('Perfil', () => {
  let component: Perfil;
  let fixture: ComponentFixture<Perfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({      
      imports: [Perfil, ReactiveFormsModule]
    }).compileComponents();

    localStorage.setItem('usuarios', JSON.stringify([
      {
        usuario: 'usuario1',
        email: 'usuario1@mail.com',
        password: 'Pass123',
        direccion: 'Calle Falsa 123',
        fechaNacimiento: '2000-01-01',
        tipo: 'usuario'
      }
    ]));

    localStorage.setItem('sesion', JSON.stringify({
      usuario: 'usuario1',
      logueado: true,
      tipo: 'usuario'
    }));

    fixture = TestBed.createComponent(Perfil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería cargar los datos del usuario desde localStorage', () => {
    expect(component.editarPerfilForm.get('usuario')?.value).toBe('usuario1');
    expect(component.editarPerfilForm.get('email')?.value).toBe('usuario1@mail.com');
  });

  it('debería tener el formulario inválido si falta el email', () => {
    component.editarPerfilForm.get('email')?.setValue('');
    expect(component.editarPerfilForm.invalid).toBeTrue();
  });

  it('debería actualizar el perfil correctamente', () => {
    component.editarPerfilForm.get('direccion')?.setValue('Nueva dirección');
    component.editarPerfil();

    const usuariosActualizados = JSON.parse(localStorage.getItem('usuarios')!);
    expect(usuariosActualizados[0].direccion).toBe('Nueva dirección');
    expect(component.mensaje).toBe('Perfil actualizado exitosamente.');
  });

  it('debería mostrar mensaje de error si el formulario es inválido', () => {
    component.editarPerfilForm.get('email')?.setValue('');
    component.editarPerfil();
    expect(component.error).toBe('Por favor completa todos los campos correctamente.');
  });
});