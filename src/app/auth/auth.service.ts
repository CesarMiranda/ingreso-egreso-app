import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';

import * as firebase from 'firebase';
import { map } from 'rxjs/operators';

import Swal from 'sweetalert2';
import { User } from './user.model';

import { Store } from '@ngrx/store';
import { AppState } from './../app.reducer';
import { ActivarLoadingAction, DesActivarLoadingAction } from './../shared/ui.actions';
import { SetUserAction } from './auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubscription: Subscription = new Subscription();

  constructor(private afAuth: AngularFireAuth, private router: Router, private afDB: AngularFirestore, private store: Store<AppState>) { }

  initAuthListener() {

    this.userSubscription = this.afAuth.authState.subscribe((fbUser: firebase.User) => {
      // console.log(fbUser);
      if (fbUser) {
        this.afDB.doc(`${ fbUser.uid }/usuario`)
          .valueChanges()
          .subscribe( (usuarioObj: any) => {

            const newUser = new User(usuarioObj);
            this.store.dispatch(new SetUserAction(newUser));
          } );
      } else {
        this.userSubscription.unsubscribe();
      }
    });
  }

  crearUsuario(email: string, password: string, nombre: string, ) {
    this.store.dispatch(new ActivarLoadingAction());

    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    .then(usuario => {
      // console.log(usuario);
      const user: User = {
        uid: usuario.user.uid,
        nombre: nombre,
        email: usuario.user.email
      };

      this.afDB.doc(`${ user.uid }/usuario`)
        .set(user)
        .then( () => {
          this.store.dispatch(new DesActivarLoadingAction());
          this.router.navigate(['/']);
        });

    })
    .catch(error => {
      // console.error(error);
      this.store.dispatch(new DesActivarLoadingAction());
      Swal('Error en el login', error.message, 'error');
    });
  }

  loginUsuario(email: string, password: string) {

    this.store.dispatch( new ActivarLoadingAction() );

    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(resp => {
        // console.log(resp);
        this.store.dispatch(new DesActivarLoadingAction());
        this.router.navigate(['/']);
      })
      .catch(error => {
        console.log(error);
        this.store.dispatch(new DesActivarLoadingAction());
        Swal('Error en el login', error.message, 'error');
      });
  }

  logout() {
    this.afAuth.auth.signOut()
    .then(resp => {
      // console.log(resp);
      this.router.navigate(['/login']);
    })
    .catch(error => {
      console.log(error);
    });
  }

  isAuth() {
    return this.afAuth.authState
      .pipe(
        map( fbUser => {
          if (fbUser === null) {
            this.router.navigate(['/login']);
          }
          return fbUser != null;
        })
      );
  }

}
