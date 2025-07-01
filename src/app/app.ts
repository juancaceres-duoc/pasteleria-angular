import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { LoginComponent } from './login/login';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet , Navbar, LoginComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'webApp';
}
