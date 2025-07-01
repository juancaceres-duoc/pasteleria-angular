import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalLoginService { 
  private openLoginModalSource = new Subject<void>();  
  openLoginModal$ = this.openLoginModalSource.asObservable();
  triggerOpenLoginModal() {
    this.openLoginModalSource.next();
  }
}
