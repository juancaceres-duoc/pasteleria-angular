import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarritoService, Producto } from '../services/carrito-service';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-categoria',
  imports: [CommonModule],
  templateUrl: './categoria.html',
  styleUrl: './categoria.css'
})

export class Categoria implements OnInit {
  categoriaSeleccionada: any = null;
  usuario: any = null;

  private datos = [
    {
      nombre: 'Tortas y Pasteles',
      ruta: 'tortas',
      items: [{
        nombre: 'Torta de Biscocho Frutilla',
        descripcion: 'Deliciosa torta de biscocho con crema de frutilla y decorada con fresas frescas.',
        precio: 18000,
        imagen: 'categorias/tortas/torta_biscocho_frutilla.jpg',
        datanombre: 'Torta Biscocho Frutilla'
      },
      {
        nombre: 'Torta Selva Negra',
        descripcion: 'Clásica torta de chocolate, crema y guindas, con virutas de chocolate amargo.',
        precio: 22000,
        imagen: 'categorias/tortas/torta_selva_negra.jpg',
        datanombre: 'Torta Selva Negra'
      },
      {
        nombre: 'Torta Biscocho Frambuesa',
        descripcion: 'Capas suaves de bizcocho rellenas con crema de vainilla y frambuesas naturales.',
        precio: 19000,
        imagen: 'categorias/tortas/torta_biscocho_frambuesa.jpg',
        datanombre: 'Torta Biscocho Frambuesa'
      }


      ]
    },
    {
      nombre: 'Tartas y Cheesecakes', ruta: 'tartas', items: [{
        nombre: 'Cheesecake de Frambuesa',
        descripcion: 'Base crocante, relleno suave y cobertura de frambuesas naturales.',
        precio: 19000,
        imagen: 'categorias/tartas/Cheesecake_de_Frambuesa.jpg',
        datanombre: 'Cheesecake de Frambuesa'
      },
      {
        nombre: 'Cheesecake de Maracuyá',
        descripcion: 'Cheesecake cremoso con un topping ácido y vibrante de maracuyá.',
        precio: 20000,
        imagen: 'categorias/tartas/Cheesecake_de_Maracuya.jpg',
        datanombre: 'Cheesecake de Maracuya'
      },
      {
        nombre: 'Kuchen de Merengue Frambuesa',
        descripcion: 'Clásico alemán con masa suave, frambuesa y merengue dorado.',
        precio: 18500,
        imagen: 'categorias/tartas/Kuchen_de_Merengue_Frambuesa.jpg',
        datanombre: 'Kuchen de Merengue Frambuesa'
      }]
    },
    {
      nombre: 'Galletas y Masas', ruta: 'galletas', items: [{
        nombre: 'Berlín Grande',
        descripcion: 'Clásico relleno con mermelada, suave y esponjoso, ideal para un antojo dulce.',
        precio: 2500,
        imagen: 'categorias/galletas/Berlin_Grande_Mermelada.jpg',
        datanombre: 'Berlín Grande'
      },
      {
        nombre: 'Galletas Surtidas',
        descripcion: 'Selección artesanal de galletas de mantequilla, chocolate y frutas.',
        precio: 5000,
        imagen: 'categorias/galletas/Galletas_Surtidas.jpg',
        datanombre: 'Galletas Surtidas'
      },
      {
        nombre: 'Palmeritas',
        descripcion: 'Hojaldre crocante caramelizado, ligero y perfecto para acompañar el café.',
        precio: 3000,
        imagen: 'categorias/galletas/Palmera.jpg',
        datanombre: 'Palmeritas'
      }]
    },
    {
      nombre: 'Chocolate y Bombones', ruta: 'chocolates', items: [{
        nombre: 'Bombones Surtidos',
        descripcion: 'Variedad artesanal de bombones con rellenos de frutas, licores y cremas suaves.',
        precio: 8500,
        imagen: 'categorias/chocolates/Bombones_surtidos.jpg',
        datanombre: 'Bombones Surtidos'
      },
      {
        nombre: 'Fina Caja de Bombones',
        descripcion: 'Presentación elegante con selección premium de bombones belgas.',
        precio: 23000,
        imagen: 'categorias/chocolates/Fina_Caja_de_Bombones.jpg',
        datanombre: 'Fina Caja de Bombones'
      },
      {
        nombre: 'Caja de Pralinen',
        descripcion: 'Pralinés de alta calidad con cobertura de chocolate y corazón cremoso.',
        precio: 15000,
        imagen: 'categorias/chocolates/Caja_de_Pralinen.jpg',
        datanombre: 'Caja de Pralinen'
      }]
    }
  ];

  constructor(private route: ActivatedRoute, private carritoService: CarritoService, private authService: AuthService){ 

  }

  ngOnInit() {
    this.usuario = this.authService.getSesion();
    this.route.paramMap.subscribe(params => {
      const nombreCategoria = params.get('nombre');
      this.categoriaSeleccionada = this.datos.find(cat => cat.ruta === nombreCategoria) || null;

    });
  }
  agregarAlCarrito(item: any) {
    if (!this.usuario) {
      alert('Debes iniciar sesión para agregar productos al carrito.');
      return;
    }

    const producto: Producto = {
      nombre: item.datanombre,
      precio: item.precio,
      cantidad: 1,
      imagen: item.imagen
    };

    this.carritoService.agregarProducto(this.usuario.usuario, producto);
    alert(`Agregado: ${producto.nombre}`);
  }
}