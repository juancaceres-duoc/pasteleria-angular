import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-editar-promo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-promo.html',
  styleUrls: ['./edit-promo.css']
})
export class ModalEditarPromo implements OnInit {
  @Input() promo: any = {};
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<any>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: [this.promo.nombre],
      descripcion: [this.promo.descripcion],
      precio: [this.promo.precio],
      productosTexto: [this.promo.productos?.join('\n')],
      validoHasta: [this.promo.validoHasta?.substring(0, 10)]
    });
  }

  guardarCambios(): void {
    const formValue = this.form.value;
    const promoEditada = {
      ...this.promo,
      nombre: formValue.nombre,
      descripcion: formValue.descripcion,
      precio: formValue.precio,
      productos: formValue.productosTexto
        .split('\n')
        .map((p: string) => p.trim())
        .filter(Boolean),
      validoHasta: formValue.validoHasta
    };
    this.guardar.emit(promoEditada);
  }
}