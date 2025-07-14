import { Component, OnInit } from '@angular/core';
import { PromocionesService } from '../services/promociones-service';
import { AuthService } from '../services/auth-service';
import { CommonModule } from '@angular/common';
import { ModalEditarPromo } from '../edit-promo/edit-promo';
import { Router } from '@angular/router';

@Component({
  selector: 'app-promociones',
  standalone: true,
  imports: [CommonModule, ModalEditarPromo],
  templateUrl: './promociones.html',
  styleUrl: './promociones.css'
})
export class Promociones implements OnInit {

  promociones: any[] = [];
  tipoUsuario: string = '';
  promoSeleccionada: any = null;
  modoCreacion: boolean = false;

  constructor(
    private promocionesService: PromocionesService,
    private authService: AuthService,
    private router: Router
  ) { }

  nuevaPromo(): void {
    this.modoCreacion = true;
    this.promoSeleccionada = {
      id: this.generarNuevoId(),
      nombre: '',
      descripcion: '',
      precio: 0,
      productos: [],
      validoHasta: ''
    };
  }

  ngOnInit(): void {
    this.authService.sesion$.subscribe(sesion => {
      this.tipoUsuario = sesion?.tipo || '';
    });

    this.promocionesService.getPromociones().subscribe((data: any[]) => {
      this.promociones = data;
    });
  }

  editarPromo(promo: any): void {
    this.modoCreacion = false;
    this.promoSeleccionada = { ...promo };
  }

  eliminarPromo(promo: any): void {
    if (confirm('¿Estás seguro de eliminar la promoción "' + promo.nombre + '"?')) {
      this.promociones = this.promociones.filter(p => p !== promo);
      if (typeof window !== 'undefined') {
        localStorage.setItem('promociones', JSON.stringify(this.promociones));
      }
    }
  }

  cerrarModal(): void {
    this.promoSeleccionada = null;
  }

  generarNuevoId(): number {
    let maxId = 0;

    for (const promo of this.promociones) {
      if (promo.id > maxId) {
        maxId = promo.id;
      }
    }
    return maxId + 1;
  }

  guardarCambiosPromo(promo: any): void {
    const index = this.promociones.findIndex(p => p.id === promo.id);

    if (this.modoCreacion || index === -1) {
      this.promociones.push(promo);
    } else {
      this.promociones[index] = promo;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('promociones', JSON.stringify(this.promociones));
    }
    this.cerrarModal();
  }

  recargarDesdeApi(): void {
    this.promocionesService.getPromociones(true).subscribe(data => {
      this.promociones = data;
      alert('Promociones recargadas desde la API');
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/promociones']);
      });
    });
  }
}