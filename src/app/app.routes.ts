import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Categoria } from './categoria/categoria';
import { Admin } from './admin/admin';
import { Perfil } from './perfil/perfil';
import { Registro } from './registro/registro';
import { Carrito } from './carrito/carrito';
import { Recuperar } from './recuperar/recuperar';
import { Promociones } from './promociones/promociones';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'categoria/tortas', component: Categoria, data: { nombre: 'tortas' } },
    { path: 'categoria/galletas', component: Categoria, data: { nombre: 'galletas' } },
    { path: 'categoria/tartas', component: Categoria, data: { nombre: 'tartas' } },
    { path: 'categoria/chocolates', component: Categoria, data: { nombre: 'chocolates' } },
    { path: 'admin', component: Admin },
    { path: 'perfil', component: Perfil },
    { path: 'registro', component: Registro },
    { path: 'carrito', component: Carrito },
    { path: 'recuperar', component: Recuperar },
    { path: 'promociones', component: Promociones }
]