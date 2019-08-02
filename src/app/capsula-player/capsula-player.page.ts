import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Capsula } from '../services/capsula.model';
import { ActivatedRoute } from '@angular/router';
import { Platform, ActionSheetController } from '@ionic/angular';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { AppComponent } from '../app.component';
import { AudioPlayerService } from '../services/audio-player.service';
import { PlaylistPage } from '../playlist/playlist.page';
import { PlaylistService } from '../services/playlist.service';

@Component({
  selector: 'app-capsula-player',
  templateUrl: './capsula-player.page.html',
  styleUrls: ['./capsula-player.page.scss'],
})
export class CapsulaPlayerPage implements OnInit {

  passData: string;
  data: Observable < any > ;
  defaultData: Observable < any > ;
  progTitle: string;
  progImage: string;
  podTitle: string;
  placeholderImg: string;

  titulo: string;
  descripcion: string;
  horario: string;
  repeticion: string;
  locutor: string;
  image: string;

  podcastCollection: AngularFirestoreCollection < Capsula > ;
  capsulasList: any;
  capsulasListAudio: any;

  player: any;
  playerStatus = 'Detenido';
  paused = false;

  currentAudio: string;
  currentId: string;

  tagList: any;
  capsulas = {
    lacienciadelrock: {
      titulo: 'La ciencia del Rock',
      descripcion: '',
      autor: 'Lalo Ibeas',
      // tslint:disable-next-line:max-line-length
      image: '../assets/imgs/covers/ciencia-del-rock.jpg'
    },
    desafiolatam: {
      titulo: 'Desafío Latam',
      descripcion: '',
      autor: 'Desafío Latam',
      // tslint:disable-next-line:max-line-length
      image: '../assets/imgs/covers/desafio-latam.jpg'
    },
    widefense: {
      titulo: 'Widefense',
      descripcion: '',
      autor: 'Widefense',
      // tslint:disable-next-line:max-line-length
      image: '../assets/imgs/covers/widefense.jpg'
    },
    clubcienciaschile: {
      titulo: 'Club de Ciencias Chile',
      descripcion: '',
      autor: 'Club de Ciencias Chile',
      // tslint:disable-next-line:max-line-length
      image: '../assets/imgs/covers/ccc.jpg'
    },
    redi: {
      titulo: 'Asociación Red de Investigadoras',
      descripcion: '',
      autor: 'Asociación Red de Investigadoras',
      // tslint:disable-next-line:max-line-length
      image: '../assets/imgs/covers/ari.jpg'
    },
    cchen: {
      titulo: 'Comisión Chilena de Energía Nuclear',
      descripcion: '',
      autor: 'Comisión Chilena de Energía Nuclear',
      // tslint:disable-next-line:max-line-length
      image: '../assets/imgs/covers/cchen.jpg'
    },
    chilecientifico: {
      titulo: 'Chile Científico',
      descripcion: '',
      autor: 'Chile Científico',
      // tslint:disable-next-line:max-line-length
      image: '../assets/imgs/covers/chilecientifico.jpg'
    },
  };
  streamType: string;

  subscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    public db: AngularFirestore,
    public playerService: AudioPlayerService,
    private platform: Platform,
    private ga: GoogleAnalytics,
    public actionSheetController: ActionSheetController,
    private app: AppComponent,
    private playlistService: PlaylistService
  ) { 
    this.subscription = this.playerService.getAction().subscribe(action => {
      this.playerStatus = action.state;
      this.streamType = action.type;
      this.currentId = action.currentId;
    });
  }

  ngOnInit() {

    this.streamType = this.playerService.streamType;
    this.passData = this.activatedRoute.snapshot.paramMap.get('data');
    this.placeholderImg = './assets/imgs/covers/placeholder.jpg';
    this.playerStatus = this.playerService.playerStatus;
    this.currentId = this.playerService.currentId;

    this.populateInfo();

    this.getCapsulasList(this.passData).subscribe(res => {
      this.capsulasList = res;
    });

    this.progTitle = this.capsulas[this.passData].titulo;
    this.progImage = this.capsulas[this.passData].image;

    this.db.collection(this.passData, q => q.orderBy('fecha', 'desc')).snapshotChanges().subscribe(serverItems => {
      this.capsulasList = [];
      serverItems.forEach(a => {
        const capsula: any = a.payload.doc.data();
        capsula.id = a.payload.doc.id;
        this.capsulasList.push(capsula);
      });
    });
  }

  ionViewWillEnter() {
    this.streamType = this.playerService.streamType;
    this.playerStatus = this.playerService.playerStatus;
    this.currentId = this.playerService.currentId;
  }

  play(url, type, info, id, prog, thumb) {
    this.playerService.stop();
    this.playerService.play(url, type, info, id, prog, thumb);
  }

  stop() {
    this.playerService.stop();
  }

  getCapsulasList(d) {
    return this.db.collection(d).snapshotChanges();
  }

  populateInfo() {
    this.titulo = this.capsulas[this.passData].titulo;
    this.descripcion = this.capsulas[this.passData].descripcion;
    this.horario = this.capsulas[this.passData].horario;
    this.repeticion = this.capsulas[this.passData].repeticion;
    this.locutor = this.capsulas[this.passData].locutor;
    this.image = this.capsulas[this.passData].image;
  }

  async presentActionSheet(url, type, info, id, prog, thumb) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [{
        text: 'Reproducir',
        icon: 'arrow-dropright-circle',
        handler: () => {
          this.play(url, type, info, id, prog, thumb);
        }
      }, {
        text: 'Agregar a playlist',
        icon: 'list',
        handler: () => {
          this.playlistService.add(url, type, info, id, prog, thumb);
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

}
