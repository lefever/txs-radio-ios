import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { AudioPlayerService } from '../services/audio-player.service';
import { Platform } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

@Component({
  selector: 'app-capsulas',
  templateUrl: './capsulas.page.html',
  styleUrls: ['./capsulas.page.scss'],
})
export class CapsulasPage implements OnInit {

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
  latestCienciaDelRock: any;
  latestDesafioLatam: any;
  latestWidefense: any;
  latestClubCienciasChile: any;
  latestAsociacionInvestigadoras: any;
  latestComisionChilenaEnergia: any;
  latestChileCientifico: any;

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
    console.log(this.playerStatus);
  }

  getList() {
    this.db.collection('lacienciadelrock', q => q.orderBy('fecha', 'desc').limit(5)).snapshotChanges().subscribe(serverItems => {
      this.latestCienciaDelRock = [];
      serverItems.forEach(a => {
        const capsula: any = a.payload.doc.data();
        capsula.id = a.payload.doc.id;
        this.latestCienciaDelRock.push(capsula);
      });
    });

    this.db.collection('widefense', q => q.orderBy('fecha', 'desc').limit(5)).snapshotChanges().subscribe(serverItems => {
      this.latestWidefense = [];
      serverItems.forEach(a => {
        const capsula: any = a.payload.doc.data();
        capsula.id = a.payload.doc.id;
        this.latestWidefense.push(capsula);
      });
    });

    this.db.collection('desafiolatam', q => q.orderBy('fecha', 'desc').limit(5)).snapshotChanges().subscribe(serverItems => {
      this.latestDesafioLatam = [];
      serverItems.forEach(a => {
        const capsula: any = a.payload.doc.data();
        capsula.id = a.payload.doc.id;
        this.latestDesafioLatam.push(capsula);
      });
    });

    this.db.collection('clubcienciaschile', q => q.orderBy('fecha', 'desc').limit(5)).snapshotChanges().subscribe(serverItems => {
      this.latestClubCienciasChile = [];
      serverItems.forEach(a => {
        const capsula: any = a.payload.doc.data();
        capsula.id = a.payload.doc.id;
        this.latestClubCienciasChile.push(capsula);
      });
    });

    this.db.collection('redi', q => q.orderBy('fecha', 'desc').limit(5)).snapshotChanges().subscribe(serverItems => {
      this.latestAsociacionInvestigadoras = [];
      serverItems.forEach(a => {
        const capsula: any = a.payload.doc.data();
        capsula.id = a.payload.doc.id;
        this.latestAsociacionInvestigadoras.push(capsula);
      });
    });

    this.db.collection('cchen', q => q.orderBy('fecha', 'desc').limit(5)).snapshotChanges().subscribe(serverItems => {
      this.latestComisionChilenaEnergia = [];
      serverItems.forEach(a => {
        const capsula: any = a.payload.doc.data();
        capsula.id = a.payload.doc.id;
        this.latestComisionChilenaEnergia.push(capsula);
      });
    });


    this.db.collection('chilecientifico', q => q.orderBy('fecha', 'desc').limit(5)).snapshotChanges().subscribe(serverItems => {
      this.latestChileCientifico = [];
      serverItems.forEach(a => {
        const capsula: any = a.payload.doc.data();
        capsula.id = a.payload.doc.id;
        this.latestChileCientifico.push(capsula);
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
