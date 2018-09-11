import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {

  constructor(public _authService: AuthService) { }

  ngOnInit() {
  }

  onSubmit(valor: any) {
    this._authService.crearUsuario(valor.email, valor.password, valor.nombre);
  }

}
