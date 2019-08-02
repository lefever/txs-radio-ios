import { Component, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { AudioPlayerService } from '../services/audio-player.service';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { Platform, NavController, AlertController, IonContent } from '@ionic/angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticatorService } from '../services/authenticator.service';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable, Subscription } from 'rxjs';
import { User } from '../services/user';
import * as firebase from 'firebase';

@Component({
  selector: 'app-video',
  templateUrl: './video.page.html',
  styleUrls: ['./video.page.scss'],
})
export class VideoPage implements OnInit {
  @ViewChild(IonContent) msgContainer: IonContent;
  streamType: string;
  userDetails$: Observable < any > ;
  userDetails: User;
  chatControl: any;
  playerStatus: string;
  current: string;

  messages: Observable < any > ;
  subscription: Subscription;
  message = '';

  btnPlay = 'block';
  btnStop = 'none';
  btnLoad = 'none';

  liveInfoRef: AngularFirestoreCollection < any > ;
  liveInfo: any;
  liveInfo$ = false;
  paused: boolean;
  
  constructor(
    private playerService: AudioPlayerService,
    private ga: GoogleAnalytics,
    private platform: Platform,
    public navCtrl: NavController,
    public db: AngularFireDatabase,
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    private formBuilder: FormBuilder,
    private authenticatorService: AuthenticatorService,
    public alert: AlertController,
    public router: Router,
    private app: AppComponent
  ) {
    this.messages = db.list('/messages', ref => ref.orderByKey().limitToLast(60)).valueChanges();
    this.chatControl = this.formBuilder.group({
      message: ['', Validators.required]
    });

    this.userDetails$ = this.afAuth.authState;
    this.userDetails$.subscribe(userDetails => {
      if (userDetails) {
        this.userDetails = new User(userDetails);
      }
    });

    this.playerStatus = this.playerService.playerStatus;

    this.messages.subscribe(() => {
      setTimeout(() => this.msgContainer.scrollToBottom(), 250);
    });
  }

  ngOnInit() {
    this.playerService.stop();
    this.app.streamType = 'video';

    // Analytics
    this.ga.trackView('List Page')
    .then(() => {})
    .catch(e => console.log(e));

    this.trackEvent('Play Video');
  }

  trackEvent(info) {
    if (this.platform.is('cordova')) {
      this.ga.trackEvent('App', 'Video', info, 0);
      console.log(info);
    }
  }

  ionViewWillEnter() {
    this.app.streamType = 'video';
  }

  ionViewDidLeave() {
    this.app.streamType = null;
  }

  ngAfterViewInit() {
    this.msgContainer.scrollToBottom();
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
