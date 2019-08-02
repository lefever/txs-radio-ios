import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { AudioPlayerService } from '../services/audio-player.service';
import { Platform, ActionSheetController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { Subscription, Observable } from 'rxjs';
import { Podcast } from '../services/podcast.model';
import { PlaylistPage } from '../playlist/playlist.page';
import { PlaylistService } from '../services/playlist.service';

@Component({
  selector: 'app-podcast-player',
  templateUrl: './podcast-player.page.html',
  styleUrls: ['./podcast-player.page.scss'],
})
export class PodcastPlayerPage implements OnInit {
  passData: string;
  data: Observable<any>;
  defaultData: Observable < any > ;
  progTitle: string;
  progImage: string;
  podTitle: string;
  placeholderImg: string;
  streamType: string;

  titulo: string;
  descripcion: string;
  horario: string;
  repeticion: string;
  locutor: string;
  image: string;

  podcastCollection: AngularFirestoreCollection < Podcast > ;
  podcastList: any;
  podcastListAudio: any;

  player: any;
  playerStatus: any;
  paused = false;

  currentAudio: string;
  currentId: string;
  subscription: Subscription;

  programas = {
    helloworld: {
      titulo: 'Hello World',
      descripcion: 'Descubre cada mañana las sorpresas que nos entregan los avances tecnológicos y científicos en Chile y en el mundo.',
      horario: 'Lun-Vie 09:00',
      repeticion: 'Lun-Vie: 17:30 / Sab-dom 09:00',
      locutor: 'Felipe Ovalle',
      // tslint:disable-next-line:max-line-length
      image: '../assets/imgs/covers/helloworld.jpg'
    },
    txstopic: {
      titulo: 'TXS Topic',
      descripcion: 'Todas las tendencias en tecnología lo conoceremos junto a la periodista Vale Ortega en Trending Topic.',
      horario: 'Lun-Vie 11:00',
      repeticion: 'Lun-Vie 18:30 / Sab-Dom 11:00',
      locutor: 'Valeria Ortega',
      // tslint:disable-next-line:max-line-length
      image: '../assets/imgs/covers/txstopic.jpg'
    },
    rockstars: {
      titulo: 'Rockstars',
      // tslint:disable-next-line:max-line-length
      descripcion: 'La ciencia tiene a sus rockstars y estarán en TXSRadio.com. Gabriel León nos contará cada día su visión de la ciencia en Chile y el mundo.',
      horario: 'Lun-Vie 12:30',
      repeticion: 'Lun-Vie 21:30 / Sab-Dom 12:30',
      locutor: 'Gabriel León',
      // tslint:disable-next-line:max-line-length
      image: '../assets/imgs/covers/rockstars.jpg'
    },
    hiperconectados: {
      titulo: 'Hiper Conectados',
      // tslint:disable-next-line:max-line-length
      descripcion: 'Lo que pasa en tecnología y en el mundo del entretenimiento digital con el periodista informático Cristián Chaparro.',
      horario: 'Lun-Vie 14:00',
      repeticion: 'Lun-Vie 20:00 / Sab-Dom 14:00',
      locutor: 'Cristián Chaparro',
      // tslint:disable-next-line:max-line-length
      image: '../assets/imgs/covers/hiperconectados.jpg'
    },
    saladesituaciones: {
      titulo: 'Sala de Situaciones',
      // tslint:disable-next-line:max-line-length
      descripcion: 'La Ciberseguridad es un área trascendental en el mundo actual, por lo mismo tendremos un espacio para conocer sus diversas aristas.',
      horario: 'Lun-Vie 16:00',
      repeticion: 'Lun-Vie 22:30 / Sab-Dom 16:00',
      locutor: 'Jaime Coloma',
      // tslint:disable-next-line:max-line-length
      image: '../assets/imgs/covers/saladesituaciones.jpg'
    },
    cienciaimposible: {
      titulo: 'Ciencia Imposible',
      // tslint:disable-next-line:max-line-length
      descripcion: 'Ciencia imposible es un programa que une la ciencia con la ficción, dando explicación científica a todo aquello que hasta ahora era imposible.',
      horario: 'Lun 10:00',
      repeticion: 'Lun 19:00',
      locutor: 'Profesor Robbie',
      // tslint:disable-next-line:max-line-length
      image: '../assets/imgs/covers/cienciaimposible.jpg'
    },
    cronicascientificas: {
      titulo: 'Crónicas Científicas',
      // tslint:disable-next-line:max-line-length
      descripcion: 'Crónicas científicas reune a especialistas, los cuales detallan sus investigaciones en ciencia y tecnología.',
      horario: 'Jue 10:00',
      repeticion: 'Jue 19:00',
      locutor: 'Macarena Rojas Abalos',
      // tslint:disable-next-line:max-line-length
      image: '../assets/imgs/covers/cronicascientificas.jpg'
    },
    nuevasestrellas: {
      titulo: 'Nuevas Estrellas',
      // tslint:disable-next-line:max-line-length
      descripcion: 'Programa donde conoceremos a nuevos científicos.',
      horario: 'Vie 10:00',
      repeticion: 'Vie 19:00',
      locutor: 'Raimundo Roberts',
      // tslint:disable-next-line:max-line-length
      image: '../assets/imgs/covers/nuevasestrellas.jpg'
    }
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    public db: AngularFirestore,
    private ga: GoogleAnalytics,
    public playerService: AudioPlayerService,
    private platform: Platform,
    private app: AppComponent,
    private actionSheetController: ActionSheetController,
    private playlistService: PlaylistService
    ) {
      this.subscription = this.playerService.getAction().subscribe(action => {
        this.playerStatus = action.state;
        this.streamType = action.type;
        this.currentId = action.currentId;
      });
      this.playerStatus = this.playerService.playerStatus;
    }

  ngOnInit() {
    // Analytics
    this.ga.trackView('List Page')
    .then(() => {})
    .catch(e => console.log(e));

    this.passData = this.activatedRoute.snapshot.paramMap.get('data');
    this.placeholderImg = './assets/imgs/covers/placeholder.jpg';
    this.currentId = this.playerService.currentId;

    this.populateInfo();

    this.getPodcastList(this.passData).subscribe(res => {
      this.podcastList = res;
    });

    this.progTitle = this.programas[this.passData].titulo;
    this.progImage = this.programas[this.passData].image;

    this.db.collection(this.passData, q => q.orderBy('fecha', 'desc')).snapshotChanges().subscribe(serverItems => {
      this.podcastList = [];
      serverItems.forEach(a => {
        const podcast: any = a.payload.doc.data();
        podcast.id = a.payload.doc.id;
        this.podcastList.push(podcast);
        podcast.tag = [];
        podcast.tag = podcast.tags.split(', ');
      });
    });
  }

  ionViewWillEnter() {
    this.streamType = this.playerService.streamType;
    this.playerStatus = this.playerService.playerStatus;
    this.currentId = this.playerService.currentId;
    console.log(this.playerStatus + ' ' + this.streamType + ' ' + this.currentId);
  }

  populateInfo() {
    this.titulo = this.programas[this.passData].titulo;
    this.descripcion = this.programas[this.passData].descripcion;
    this.horario = this.programas[this.passData].horario;
    this.repeticion = this.programas[this.passData].repeticion;
    this.locutor = this.programas[this.passData].locutor;
    this.image = this.programas[this.passData].image;
  }

  getPodcastList(d) {
    return this.db.collection(d).snapshotChanges();
  }

  play(url, type, info, id, prog, thumb) {
    this.playerService.stop();
    this.playerService.play(url, type, info, id, prog, thumb);
  }

  stop() {
    this.playerService.stop();
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
