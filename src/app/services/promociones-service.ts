import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PromocionesService {
  private apiUrl = 'https://juancaceres-duoc.github.io/json-api/promociones.json';
  private localKey = 'promociones';

  constructor(private http: HttpClient) { }

  getPromociones(forzarApi: boolean = false) {
    if (
      !forzarApi &&
      typeof window !== 'undefined' &&
      localStorage.getItem(this.localKey)
    ) {
      const data = localStorage.getItem(this.localKey);
      return of(JSON.parse(data!));
    } else {
      return this.http.get<any[]>(this.apiUrl).pipe(
        tap(data => {
          if (typeof window !== 'undefined') {
            localStorage.setItem(this.localKey, JSON.stringify(data));
          }
        })
      );
    }
  }
}