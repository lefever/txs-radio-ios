import { User } from '../services/user';
import { Config } from '../services/config';
import { AppComponent } from './../app.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticatorService } from '../services/authenticator.service';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Loader } from '../services/loader';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user: any;
  loginUserForm: FormGroup;
  userDetails: User;
  isLogged: boolean;
  settingsForm: any;
  email: string;

  constructor(
    public modalController: ModalController,
    private formBuilder: FormBuilder,
    public alert: AlertController,
    private platform: Platform,
    private authenticator: AuthenticatorService,
    private router: Router,
    public config: Config,
    public auth: AngularFireAuth
  ) { 
    auth.authState.subscribe(user => {
      this.user = user;
      if (this.user) {
        this.settingsForm.patchValue({ fullName: user.displayName });
      }
    });

    this.loginUserForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.settingsForm = this.formBuilder.group({
      fullName: ['', Validators.required]
    });

    this.email = this.config.email;
  }

  ngOnInit() {
  }
  doSomethingAfterUserLogin(user) {
    this.user = user;
    this.config.username = user.user.displayName;
    this.config.uid = user.user.uid;
    this.config.email = user.user.email;
    this.config.uavatar = user.user.photoURL;
    console.log(user);
  }

  // Anonymous user login
  anonymousUser() {
    this.authenticator.anonymousUser()
    .then((user) => {
      this.doSomethingAfterUserLogin(user);
    })
    .catch((e) => {
      this.alert.create({
        header: 'Error',
        message: e,
        buttons: [{ text: 'Ok' }]
      }).then(alert => alert.present());
    });
  }

  signInWithOAuth(provider: string) {
    this.platform.is('cordova') ? this.authenticator.signInWithOAuth(provider) : this.authenticator.signInWithOAuthBrowserMode(provider)
    .then((user) => {
      this.doSomethingAfterUserLogin(user);
    })
    .catch((e) => {
      this.alert.create({
        header: 'Error',
        message: e,
        buttons: [{ text: 'Ok' }]
      }).then(alert => alert.present());
    });
  }

  // Perform login using user and password
  login() {
    const email = this.loginUserForm.controls.email.value;
    const password = this.loginUserForm.controls.password.value;
    this.authenticator.login(email, password)
    .then((user) => {
      this.doSomethingAfterUserLogin(user);
    })
    .catch((e) => {
      this.alert.create({
        header: 'Error',
        message: e,
        buttons: [{ text: 'Ok' }]
      }).then(alert => alert.present());
    });
  }

  // Push registration view
  signUp() {
    this.router.navigateByUrl('registration');
  }

  // Reset password
  resetPassword() {
    this.alert.create({
      header: 'Recuperar contraseña',
      message: 'Ingresa tu correo y te enviaremos un email con instrucciones',
      inputs: [ { type: 'email', name: 'email', placeholder: 'Email' } ],
      buttons: [
        { text: 'Cancelar', handler: data => {} },
        {
          text: 'Ok',
          handler: data => {
            this.authenticator.resetPassword(data.email)
            .then(() => {
              this.alert.create({
                header: '¡Todo listo!',
                message: 'Tu password ha sido restablecido, por favor revisa tu correo, te hemos enviado instrucciones.',
                buttons: [{ text: 'Ok' }]
              }).then(alert => alert.present());
            })
            .catch((e) => {
              this.alert.create({
                header: 'Error',
                message: `Fallo al iniciar sesión`,
                buttons: [{ text: 'Ok' }]
              }).then(alert => alert.present());
            });
          }
        }
      ]
    }).then(alert => alert.present());
  }
  signOut() {
    this.auth.auth.signOut();
  }

}
