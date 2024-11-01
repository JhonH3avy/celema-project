import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  showDropdown = false;
  showDropdownAux = false;

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  toggleDropdownAux() {
    this.showDropdownAux = !this.showDropdownAux;
  }

}
