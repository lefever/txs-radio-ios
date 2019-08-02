import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Subscription, Observable, Subject } from 'rxjs';
import { AudioPlayerService } from './audio-player.service';
import { queue } from 'rxjs/internal/scheduler/queue';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  isPlaying = false;
  playerStatus = 'Detenido';
  currentProg = 'TXS Radio';
  currentTrack = 'Ciencia y tecnología';
  currentId: any = null;
  currentTime: any = null;
  trackDuration: any = null;
  streamType: any = null;
  time: any;
  seeking = false;

  subscription: Subscription;
  removeItem: Subscription;

  public queuedTracks: Array<{url: string, type: string, info: string, id: string, prog: string, thumb: string}> = [];
  // public queuedTracks: Array<{}> = [];

  constructor(
    private playerService: AudioPlayerService,
    public storage: Storage
  ) { 
    this.queuedTracks = [{url: 'string', type: 'string', info: 'string', id: 'string', prog: 'string', thumb: 'string'}];
    console.log(this.queuedTracks);
    this.subscription = this.playerService.getAction().subscribe(action => {
      this.playerStatus = action.state;
      this.currentId = action.currentId;
    });
    this.populateArray();
  }
  
  ionViewWillEnter() {
    this.populateArray();
    console.log(this.storage.get('queuedTracks'));
  }

  public add (url, type, info, id, prog, thumb) {
    let newTrack = {
      url: url,
      type: type,
      info: info,
      id: id,
      prog: prog,
      thumb: thumb
    };
    this.storage.set('queuedTracks', this.queuedTracks);
    // console.log(newTrack);
    // this.queuedTracks.push(newTrack);
  }

  public remove(id) {
    for(var a = 0; a < this.queuedTracks.length; a++) {
      for(var b in this.queuedTracks[a]) {
        if(this.queuedTracks[a][b] === id) {
            this.queuedTracks.splice(a, 1);
            this.storage.set('queuedTracks', this.queuedTracks);
            a--;
            break;
        }
      }
    }
  }

  getData() {
    return this.storage.get('queuedTracks');
  }

  populateArray() {
    this.getData().then((array) => {
      this.queuedTracks = array;
    });
    return this.queuedTracks;
  }
}
