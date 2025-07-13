import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Promociones } from './promociones';
import { PromocionesService } from '../services/promociones-service';

describe('Componente Promociones', () => {
  let component: Promociones;
  let fixture: ComponentFixture<Promociones>;

  const promocionesMock = [
    {
      id: 1,
      nombre: 'Combo de Prueba',
      descripcion: 'Promoción de prueba',
      precio: 1000,
      productos: ['Producto A'],
      validoHasta: '2025-08-01'
    }
  ];

  const promocionesServiceMock = {
    getPromociones: jasmine.createSpy('getPromociones').and.returnValue(of(promocionesMock))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Promociones],
      providers: [
        { provide: PromocionesService, useValue: promocionesServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Promociones);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar promociones desde el servicio', () => {
    expect(promocionesServiceMock.getPromociones).toHaveBeenCalled();
    expect(component.promociones.length).toBe(1);
    expect(component.promociones[0].nombre).toBe('Combo de Prueba');
  });

  it('debería asignar una promoción seleccionada al editar', () => {
    const promo = promocionesMock[0];
    component.editarPromo(promo);
    expect(component.promoSeleccionada).toEqual(promo);
  });

  it('debería eliminar una promoción de la lista', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.promociones = [...promocionesMock];
    component.eliminarPromo(promocionesMock[0]);
    expect(component.promociones.length).toBe(0);
  });

  it('debería agregar una nueva promoción con guardarCambiosPromo', () => {
    component.promociones = [];
    const nuevaPromo = { ...promocionesMock[0], id: 999 };
    component.modoCreacion = true;
    component.guardarCambiosPromo(nuevaPromo);
    expect(component.promociones.length).toBe(1);
    expect(component.promociones[0].id).toBe(999);
  });
});