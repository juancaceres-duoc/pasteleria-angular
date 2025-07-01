import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Producto {
  nombre: string;
  precio: number;
  cantidad: number;
  imagen?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private carritoSubject = new BehaviorSubject<Producto[]>([]);
  carrito$ = this.carritoSubject.asObservable();

  private claveCarrito(usuario: string): string {
    return 'carrito_${usuario}';  }

 
  cargarCarrito(usuario: string): void {
    const data = localStorage.getItem(this.claveCarrito(usuario));
    const carrito = data ? JSON.parse(data) : [];
    this.carritoSubject.next(carrito);
  }

  guardarCarrito(usuario: string, carrito: Producto[]): void {
    localStorage.setItem(this.claveCarrito(usuario), JSON.stringify(carrito));
    this.carritoSubject.next(carrito);
  }

  agregarProducto(usuario: string, producto: Producto): void {
    let carrito = this.carritoSubject.value || [];
    const index = carrito.findIndex((p) => p.nombre === producto.nombre);

    if (index !== -1) {
      carrito[index].cantidad += producto.cantidad;
    } else {
      carrito.push(producto);
    }

    this.guardarCarrito(usuario, carrito);
  }

  vaciarCarrito(usuario: string) {
  const vacio: Producto[] = [];
  localStorage.setItem(this.claveCarrito(usuario), JSON.stringify(vacio));
  this.carritoSubject.next(vacio);
}
}
