import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { AppState } from './../../app.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {

  cargando: boolean;
  subscription: Subscription;

  constructor(public _authService: AuthService, private router: Router, private store: Store<AppState>) { }

  ngOnInit() {

    this.subscription = this.store.select('ui')
      .subscribe( ui => this.cargando = ui.isLoading );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onLogin(data: any) {
    // console.log(data);
    this._authService.loginUsuario(data.email, data.password);
  }

}
