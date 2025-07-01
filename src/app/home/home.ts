import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * Componente Home
 *
 * Representa la página de inicio del sitio web de la pastelería.
 * Es el punto de entrada principal donde se pueden mostrar promociones,
 * presentación del negocio o accesos destacados.
 *
 * Este componente se visualiza en la ruta raíz `/` y actúa como una bienvenida
 * para los usuarios que visitan el sitio.
 */

@Component({
  selector: 'app-home',
  imports: [ RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}