import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.loading = true; // Cambia el estado a cargando

    // Simula una llamada a la API
    setTimeout(() => {
      this.loading = false; // Regresa el estado a no cargando
      this.router.navigate(['/home']);
    }, 5000);
  }

  navigateToRecover() {
    this.router.navigate(['/recuperar']);
  }

}
