import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalEditarPromo } from './edit-promo';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('ModalEditarPromo', () => {
  let component: ModalEditarPromo;
  let fixture: ComponentFixture<ModalEditarPromo>;

  const promoMock = {
    id: 1,
    nombre: 'Combo Test',
    descripcion: 'Descripción de prueba',
    precio: 5000,
    productos: ['Producto A', 'Producto B'],
    validoHasta: '2025-08-10'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditarPromo, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEditarPromo);
    component = fixture.componentInstance;
    component.promo = promoMock;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con los valores de entrada', () => {
    const form = component.form.value;
    expect(form.nombre).toBe(promoMock.nombre);
    expect(form.descripcion).toBe(promoMock.descripcion);
    expect(form.precio).toBe(promoMock.precio);
    expect(form.productosTexto).toContain('Producto A');
    expect(form.validoHasta).toBe('2025-08-10');
  });

  it('debería emitir evento guardar con los datos actualizados', () => {
    spyOn(component.guardar, 'emit');

    component.form.patchValue({
      nombre: 'Actualizado',
      descripcion: 'Nueva descripción',
      productosTexto: 'Item 1\nItem 2',
      precio: 1234,
      validoHasta: '2025-12-31'
    });

    component.guardarCambios();

    expect(component.guardar.emit).toHaveBeenCalledWith(jasmine.objectContaining({
      nombre: 'Actualizado',
      descripcion: 'Nueva descripción',
      productos: ['Item 1', 'Item 2'],
      precio: 1234,
      validoHasta: '2025-12-31'
    }));
  });

  it('debería emitir evento cerrar al presionar cancelar', () => {
    spyOn(component.cerrar, 'emit');

    const botonCancelar = fixture.debugElement.query(By.css('button[type="button"]'));
    botonCancelar.nativeElement.click();

    expect(component.cerrar.emit).toHaveBeenCalled();
  });
});