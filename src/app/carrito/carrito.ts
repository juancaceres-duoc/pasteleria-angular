import { Component, OnInit } from '@angular/core';
import { CarritoService, Producto } from '../services/carrito-service';
import { AuthService } from '../services/auth-service';
import { CommonModule } from '@angular/common';

/**
 * Componente Carrito
 * 
 * Representa la vista del carrito de compras del usuario autenticado.
 * Permite visualizar, modificar y eliminar productos agregados al carrito,
 * así como procesar el pago y vaciar el carrito.
 * 
 * Funcionalidades:
 * - Mostrar productos añadidos por el usuario.
 * - Aumentar, disminuir o eliminar la cantidad de productos.
 * - Calcular el total del carrito.
 * - Procesar el pago simulado.
 * - Vaciar el carrito después del pago.
 * 
 * Requiere que el usuario haya iniciado sesión.
 */
@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css'],
  imports: [CommonModule]
})
export class Carrito implements OnInit {

  /**
   * Arreglo que contiene los productos agregados al carrito.
   */
  carrito: Producto[] = [];

  /**
   * Objeto que representa al usuario autenticado actualmente.
   */
  usuario: any = null;

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService
  ) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   * Carga el carrito si el usuario ha iniciado sesión.
   */
  ngOnInit(): void {
    this.usuario = this.authService.getSesion();
    if (this.usuario) {
      this.carritoService.cargarCarrito(this.usuario.usuario);
      this.carritoService.carrito$.subscribe((prod) => (this.carrito = prod));
    }
  }

  /**
   * Aumenta la cantidad de un producto específico en el carrito.
   * @param index Índice del producto en el arreglo.
   */
  aumentarCantidad(index: number) {
    this.carrito[index].cantidad++;
    this.actualizarCarrito();
  }

  /**
   * Disminuye la cantidad de un producto si es mayor a 1.
   * @param index Índice del producto en el arreglo.
   */
  disminuirCantidad(index: number) {
    if (this.carrito[index].cantidad > 1) {
      this.carrito[index].cantidad--;
      this.actualizarCarrito();
    }
  }

  /**
   * Elimina un producto del carrito según su índice.
   * @param index Índice del producto a eliminar.
   */
  eliminarProducto(index: number) {
    this.carrito.splice(index, 1);
    this.actualizarCarrito();
  }

  /**
   * Vacía el carrito del usuario actual.
   */
  vaciarCarrito() {
    if (!this.usuario) return;
    this.carritoService.vaciarCarrito(this.usuario.usuario);
  }

  /**
   * Calcula el total a pagar por los productos del carrito.
   * @returns Número con el monto total.
   */
  calcularTotal(): number {
    return this.carrito.reduce(
      (total, producto) => total + producto.precio * producto.cantidad,
      0
    );
  }

  /**
   * Simula el procesamiento de pago y vacía el carrito si hay productos.
   */
  procesarPago() {
    if (this.carrito.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    alert(`Procesando pago por un total de $${this.calcularTotal()}`);
    this.carritoService.vaciarCarrito(this.usuario.usuario);
    alert('Pago procesado con éxito. Tu carrito ha sido vaciado.');  
  }

  /**
   * Actualiza el estado del carrito en el almacenamiento local.
   * Este método se invoca tras modificar cantidades o eliminar productos.
   * Solo se ejecuta si hay un usuario autenticado.
   */
  private actualizarCarrito() {
    if (!this.usuario) return;
    this.carritoService.guardarCarrito(this.usuario.usuario, this.carrito);
  }
}