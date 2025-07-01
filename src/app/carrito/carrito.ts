import { Component, OnInit } from '@angular/core';
import { CarritoService, Producto } from '../services/carrito-service';
import { AuthService } from '../services/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css'],
  imports: [CommonModule]
})
export class Carrito implements OnInit {
  carrito: Producto[] = [];
  usuario: any = null;

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getSesion();
    if (this.usuario) {
      this.carritoService.cargarCarrito(this.usuario.usuario);
      this.carritoService.carrito$.subscribe((prod) => (this.carrito = prod));
    }
  }

  aumentarCantidad(index: number) {
    this.carrito[index].cantidad++;
    this.actualizarCarrito();
  }

  disminuirCantidad(index: number) {
    if (this.carrito[index].cantidad > 1) {
      this.carrito[index].cantidad--;
      this.actualizarCarrito();
    }
  }

  eliminarProducto(index: number) {
    this.carrito.splice(index, 1);
    this.actualizarCarrito();
  }

vaciarCarrito() {
  if (!this.usuario) return;
  this.carritoService.vaciarCarrito(this.usuario.usuario);
}

  calcularTotal(): number {
    return this.carrito.reduce(
      (total, producto) => total + producto.precio * producto.cantidad,
      0
    );
  }

procesarPago() {
  if (this.carrito.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }
  
  alert(`Procesando pago por un total de $${this.calcularTotal()}`);
  this.carritoService.vaciarCarrito(this.usuario.usuario);
  alert('Pago procesado con éxito. Tu carrito ha sido vaciado.');  
}

  private actualizarCarrito() {
    if (!this.usuario) return;
    this.carritoService.guardarCarrito(this.usuario.usuario, this.carrito);
  }
}