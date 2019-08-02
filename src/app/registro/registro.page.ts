import { Config } from './../config';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Validators, FormBuilder } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Events } from '@ionic/angular';
import { Loader } from '../loader';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
// import { GoogleAnalytics } from '@ionic-native/google-analytics';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})

export class RegistroPage implements OnInit {
  user: any;

  constructor(
    private events: Events,
    public navCtrl: NavController,
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    private formBuilder: FormBuilder,
    private loader: Loader,
    private alertCtrl: AlertController,
    private router: Router,
    // private ga: GoogleAnalytics,
    public config: Config
  ) {
    this.user = formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      passwordConfirmation: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  ngOnInit() {
    // Analytics
    // this.ga.trackView('List Page')
    // .then(() => {})
    // .catch(e => console.log(e));
  }

  // Create user using form builder controls
  createUser() {
    const fullName = this.user.controls.fullName.value;
    const email = this.user.controls.email.value;
    const password = this.user.controls.password.value;
    const passwordConfirmation = this.user.controls.passwordConfirmation.value;
    this.loader.show('Creando usuario...');

    new Promise((resolve, reject) => {
      if (passwordConfirmation !== password) {
        reject(new Error('Las contraseñas no coinciden.'));
      } else {
        resolve();
      }
    })
    .then(() => {
      return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    })
    .then((user: any) => {
      this.events.publish('user:create', user);
      // Login if successfuly creates a user
      return this.afAuth.auth.signInWithEmailAndPassword(email, password);
    })
    .then((authData: any) => {
      const user = authData.user || authData;
      // CUSTOMISE: Here you can add more fields to your user registration
      // those fields will be stored on /users/{uid}/
      const userRef = this.db.object('/users/' + user.uid);
      userRef.set({
        uid: user.uid,
        provider: user.providerId,
        email: email,
        fullName: fullName,
        dateCreation: firebase.database.ServerValue.TIMESTAMP
      });
      console.log(user);
      this.router.navigateByUrl('/home');
      this.loader.hide();
    })
    .catch((e) => {
      this.loader.hide();
      this.alertCtrl.create({
        header: 'Error',
        message: `Ha fallado el inicio de sesión. ${e.message}`,
        buttons: [{ text: 'Ok' }]
      }).then(alert => alert.present());
    });
  }
}
