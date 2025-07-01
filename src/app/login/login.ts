import { Component, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ModalLoginService } from '../services/modal-login';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',  
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent implements OnDestroy {

  loginForm = new FormGroup({
    usuario: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  error: string = '';

  @ViewChild('loginModal', { static: true }) loginModal!: TemplateRef<any>;
  private subscription: Subscription;

  constructor(
    private modalService: NgbModal,
    private modalTrigger: ModalLoginService,
    private AuthService: AuthService,
    private route: Router
  ) {
    this.subscription = this.modalTrigger.openLoginModal$.subscribe(() => this.openModal());    
    this.loginForm.valueChanges.subscribe(() => {
      this.error = '';
    });
  }

  openModal() {
    this.error = '';
    this.modalService.open(this.loginModal, { size: 'lg', centered: true, backdrop: 'static' });
  }

  login() {
    this.error = '';

    if (this.loginForm.invalid) {
      this.error = 'Todos los campos son obligatorios';
      return;
    }

    const { usuario, password } = this.loginForm.value;
    const success = this.AuthService.iniciarSesion(usuario!, password!);

    if (success) {
      this.error = '';
      this.modalService.dismissAll();
      const sesion = this.AuthService.getSesion();
      window.location.href = sesion?.tipo === 'admin' ? '/admin' : '/';
    } else {
      this.error = 'Usuario o contraseña incorrectos';
    }
  }

  irARegistro() {
    this.modalService.dismissAll();
    this.route.navigate(['/registro']);
  }

  irARecuperar() {
    this.modalService.dismissAll();
    this.route.navigate(['/recuperar']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}