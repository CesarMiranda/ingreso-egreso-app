import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  constructor(public _authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onLogin(data: any) {
    console.log(data);
    this._authService.loginUsuario(data.email, data.password);
  }

}
