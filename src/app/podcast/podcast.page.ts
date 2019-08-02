import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Platform } from '@ionic/angular';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { AppComponent } from '../app.component';
import { AudioPlayerService } from '../services/audio-player.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-podcast',
  templateUrl: './podcast.page.html',
  styleUrls: ['./podcast.page.scss'],
})
export class PodcastPage implements OnInit {
  
  // Slider
  slideOpts = {
    slidesPerView: 2.5,
    speed: 400
  };

  // Player
  playerStatus: any;
  streamType: any;
  currentId: any;

  // Lastest
  latestHelloWorld: any;
  latestTxsTopic: any;
  latestHiperconectados: any;
  latestRockstars: any;
  latestSalaDeSituaciones: any;
  latestCienciaImposible: any;
  latestCronicasCientificas: any;
  latestNuevasEstrellas: any;
  
  subscription: Subscription;

  constructor(
    public db: AngularFirestore,
    public playerService: AudioPlayerService,
    public platform: Platform,
    public ga: GoogleAnalytics,
    public app: AppComponent,
  ) {
    this.subscription = this.playerService.getAction().subscribe(action => {
      this.playerStatus = action.state;
      this.streamType = action.type;
      this.currentId = action.currentId;
    });
   }

  ngOnInit() {
    this.getList();
  }

  getList() {
    this.db.collection('helloworld', q => q.orderBy('fecha', 'desc').limit(5)).snapshotChanges().subscribe(serverItems => {
      this.latestHelloWorld = [];
      serverItems.forEach(a => {
        const capsula: any = a.payload.doc.data();
        capsula.id = a.payload.doc.id;
        this.latestHelloWorld.push(capsula);
      });
    });

    this.db.collection('txstopic', q => q.orderBy('fecha', 'desc').limit(5)).snapshotChanges().subscribe(serverItems => {
      this.latestTxsTopic = [];
      serverItems.forEach(a => {
        const capsula: any = a.payload.doc.data();
        capsula.id = a.payload.doc.id;
        this.latestTxsTopic.push(capsula);
      });
    });

    this.db.collection('hiperconectados', q => q.orderBy('fecha', 'desc').limit(5)).snapshotChanges().subscribe(serverItems => {
      this.latestHiperconectados = [];
      serverItems.forEach(a => {
        const capsula: any = a.payload.doc.data();
        capsula.id = a.payload.doc.id;
        this.latestHiperconectados.push(capsula);
      });
    });

    this.db.collection('rockstars', q => q.orderBy('fecha', 'desc').limit(5)).snapshotChanges().subscribe(serverItems => {
      this.latestRockstars = [];
      serverItems.forEach(a => {
        const capsula: any = a.payload.doc.data();
        capsula.id = a.payload.doc.id;
        this.latestRockstars.push(capsula);
      });
    });

    this.db.collection('saladesituaciones', q => q.orderBy('fecha', 'desc').limit(5)).snapshotChanges().subscribe(serverItems => {
      this.latestSalaDeSituaciones = [];
      serverItems.forEach(a => {
        const capsula: any = a.payload.doc.data();
        capsula.id = a.payload.doc.id;
        this.latestSalaDeSituaciones.push(capsula);
      });
    });

    this.db.collection('cienciaimposible', q => q.orderBy('fecha', 'desc').limit(5)).snapshotChanges().subscribe(serverItems => {
      this.latestCienciaImposible = [];
      serverItems.forEach(a => {
        const capsula: any = a.payload.doc.data();
        capsula.id = a.payload.doc.id;
        this.latestCienciaImposible.push(capsula);
      });
    });

    this.db.collection('cronicascientificas', q => q.orderBy('fecha', 'desc').limit(5)).snapshotChanges().subscribe(serverItems => {
      this.latestCronicasCientificas = [];
      serverItems.forEach(a => {
        const capsula: any = a.payload.doc.data();
        capsula.id = a.payload.doc.id;
        this.latestCronicasCientificas.push(capsula);
      });
    });

    this.db.collection('nuevasestrellas', q => q.orderBy('fecha', 'desc').limit(5)).snapshotChanges().subscribe(serverItems => {
      this.latestNuevasEstrellas = [];
      serverItems.forEach(a => {
        const capsula: any = a.payload.doc.data();
        capsula.id = a.payload.doc.id;
        this.latestNuevasEstrellas.push(capsula);
      });
    });
  }

  play(url, type, info, id, prog, thumb) {
    if (this.playerStatus === 'Cargando') {
      console.log('Cargando otro track');
    } else {
      this.playerService.stop();
      this.playerService.play(url, type, info, id, prog, thumb);
    }
  }

  stop() {
    this.playerService.stop();
  }
}
