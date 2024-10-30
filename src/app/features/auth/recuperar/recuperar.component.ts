import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css']
})
export class RecuperarComponent implements OnInit {

  constructor() { }

  loading = false;

  ngOnInit(): void {
  }

  onSubmit() {
    this.loading = true; // Cambia el estado a cargando

    // Simula una llamada a la API
    setTimeout(() => {
      this.loading = false; // Regresa el estado a no cargando
      // Aquí puedes manejar la respuesta de la API
    }, 5000);
  }

}
