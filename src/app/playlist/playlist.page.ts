import { Component, OnInit, Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AudioPlayerService } from '../services/audio-player.service';
import { Subscription, Observable, Subject } from 'rxjs';
import { ActionSheetController } from '@ionic/angular';
import { PlaylistService } from '../services/playlist.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.page.html',
  styleUrls: ['./playlist.page.scss'],
})
export class PlaylistPage implements OnInit {

  subscription: Subscription;
  removeItem: Subscription;
  playerStatus: string;
  currentId: string;
  // queuedTracks = [];
  public queuedTracks: Array<{url: string, type: string, info: string, id: string, prog: string, thumb: string}> = [];


  constructor(
    private storage: Storage,
    private playerService: AudioPlayerService,
    private actionSheetController: ActionSheetController,
    private playlistService: PlaylistService
  ) { 
    this.subscription = this.playerService.getAction().subscribe(action => {
      this.playerStatus = action.state;
      this.currentId = action.currentId;
    });
    this.removeItem = this.playerService.trackEnded().subscribe(id => {
      this.remove(id.id);
      this.playerService.play(
        this.playlistService.queuedTracks[0].url,
        this.playlistService.queuedTracks[0].type,
        this.playlistService.queuedTracks[0].info,
        this.playlistService.queuedTracks[0].id,
        this.playlistService.queuedTracks[0].prog,
        this.playlistService.queuedTracks[0].thumb,
      )
    })
  }

  ngOnInit() {
    this.playlistService.populateArray();
    this.queuedTracks = this.playlistService.queuedTracks;
    this.queuedTracks = [{
      url: 'string',
      type: 'string',
      info: 'string',
      id: 'string',
      thumb: 'string'
    }];
    console.log(this.queuedTracks);
  }

  ionViewDidLoad() {
    this.queuedTracks = this.playlistService.queuedTracks;
    this.playlistService.populateArray();
  }

  ionViewWillEnter() {
    this.playlistService.populateArray();
    this.queuedTracks = this.playlistService.queuedTracks;
  }

  play(url, type, info, id, prog, thumb) {
    this.playerService.stop();
    this.playerService.play(url, type, info, id, prog, thumb);
  }

  remove(id){
    this.playlistService.remove(id);
    this.queuedTracks = this.playlistService.queuedTracks;
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
        text: 'Eliminar de playlist',
        icon: 'trash',
        handler: () => {
          this.remove(id);
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
