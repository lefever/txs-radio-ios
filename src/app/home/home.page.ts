import { AppComponent } from './../app.component';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Component, OnInit, ViewChild, EventEmitter, Injectable, Output, ElementRef, ViewChildren, QueryList} from '@angular/core';
import { Validators, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavController, IonContent, AlertController, Platform } from '@ionic/angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthenticatorService } from '../services/authenticator.service';
import { User } from '../services/user';
import { Subscription, Observable } from 'rxjs';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { map } from 'rxjs/operators';
import { AudioPlayerService } from '../services/audio-player.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonContent) msgContainer: IonContent;
  @ViewChildren('messages') msg: QueryList < any > ;

  userDetails$: Observable < any > ;
  userDetails: User;
  chatControl: any;
  playerStatus: string;
  current: string;

  // Chat messages
  messages: Observable < any > ;
  subscription: Subscription;
  message = '';

  constructor(
    public navCtrl: NavController,
    public db: AngularFireDatabase,
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    private formBuilder: FormBuilder,
    private authenticatorService: AuthenticatorService,
    public alert: AlertController,
    public router: Router,
    public playerService: AudioPlayerService,
    private platform: Platform,
    private ga: GoogleAnalytics,
    private app: AppComponent
  ) {
    this.messages = db.list('/messages', ref => ref.orderByKey().limitToLast(60)).valueChanges();
    this.chatControl = this.formBuilder.group({
      message: ['', Validators.required]
    });
    this.messages.subscribe(() => {
      setTimeout(() => this.msgContainer.scrollToBottom(), 250);
    });
  }

  sendMessage() {
    if (this.afAuth.auth.currentUser != null) {
      console.log('sending message to chat ' + this.constructor.name);

      this.db.list('/messages')
        .push({
          fullName: this.userDetails.fullName,
          // provider: this.userDetails.provider,
          avatar: this.userDetails.avatar,
          userUid: this.userDetails.uid,
          value: this.message,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        });
      this.message = '';
    } else {
      this.alert.create({
        header: 'Debes ingresar',
        message: `Para enviar mensajes debes ingresar`,
        buttons: [{
            text: 'Cancelar'
          },
          {
            text: 'Ingresar',
            handler: data => {
              this.router.navigateByUrl('/login');
            }
          }
        ]
      }).then(alert => alert.present());
    }
  }

}
