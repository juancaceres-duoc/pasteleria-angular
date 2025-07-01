import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalLoginService } from '../services/modal-login';
import { AuthService } from '../services/auth-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  sesion: any = null;

  constructor(
    private modalService: ModalLoginService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.sesion$.subscribe(sesion => {
      this.sesion = sesion;
    });
  }

  onLoginClick() {
    this.modalService.triggerOpenLoginModal();
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigate(['/']);
  }
}