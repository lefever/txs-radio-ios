import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { MusicControl } from './music-control.service';
import { Platform } from '@ionic/angular';
// import { PlaylistService } from './playlist.service';

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {

  private subject = new Subject < any > ();
  private time = new Subject < any > ();
  private removeId = new Subject < any > ();

  audioPlayer: any;

  isPlaying: boolean;
  url: string;
  currentId: string;
  currentTrack: string;
  currentTime: any;
  currentProgram: string;
  streamType: string;
  trackDuration: any;
  knobPosition: any;

  playerStatus: any;

  constructor(
    public musicControl: MusicControl,
    private platform: Platform,
    // private playlistService: PlaylistService
  ) { }

  public play(url, type, info, id, prog, thumb) {

    if (this.platform.is('cordova')){
      this.musicControl.showNotification(info, prog, thumb);
    }

    this.isPlaying = true;
    this.audioPlayer = new Audio(url);
    this.audioPlayer.play();
    this.currentId = id;
    this.currentTrack = info;
    this.currentProgram = prog;
    this.streamType = type;

    // Carga información
    this.audioPlayer.addEventListener('loadedmetadata', (event) => {
      this.trackDuration = this.audioPlayer.duration;
      console.log(event);
    });

    // Cambio en el tiempo
    this.audioPlayer.addEventListener('timeupdate', (event) => {
      console.log(this.audioPlayer.currentTime);
      this.knobPosition = (this.audioPlayer.currentTime / this.trackDuration) * 100;
      this.sendTime(this.knobPosition);
      console.log(event);
    });

    // On error
    this.audioPlayer.addEventListener('error', (ex) => {
      console.error(ex);
      this.playerStatus = 'Error';
      this.stop();
    }, false);

    // Reproduciendo
    this.audioPlayer.addEventListener('canplay', (event) => {
      this.isPlaying = true;
      this.playerStatus = 'Live';
      this.trackDuration = event.path[0].duration;
      console.log(this.audioPlayer.currentTime);
      this.sendAction('Live', type, id, info, prog);
    }, false);

    // Cargando
    this.audioPlayer.addEventListener('waiting', (event) => {
      this.isPlaying = false;
      this.sendAction('Cargando', type, id, info, prog);
    }, false);

    // Reproduciendo
    this.audioPlayer.addEventListener('playing', (event) => {
      this.playerStatus = 'Live';
      this.isPlaying = true;
      this.sendAction('Live', type, id, info, prog);
    }, false);

    // Detención
    this.audioPlayer.addEventListener('ended', () => {
      this.endTrack(id);
      console.log('Se acabò');
    }, false);
  }

  seek(event) {
    this.audioPlayer.currentTime = (this.trackDuration / 100) * event;
    this.resume();
  }

  pause() {
    this.isPlaying = false;
    this.audioPlayer.pause();
    this.sendAction('Paused', this.streamType, this.currentId, this.currentTrack, this.currentProgram);
  }

  resume() {
    this.isPlaying = true;
    this.audioPlayer.play();
    this.sendAction('Live', this.streamType, this.currentId, this.currentTrack, this.currentProgram);
  }

  stop() {
    if (this.isPlaying) {
      this.knobPosition = 0;
      this.isPlaying = !this.isPlaying;
      this.audioPlayer.pause();
      this.audioPlayer = null;
      this.currentId = null;
      this.streamType = null;
      this.sendAction('Detenido', this.streamType, this.currentId, 'Ciencia y Tecnología', 'TXS Radio');
    }
  }

  sendAction(state, type, currentId, trackName, progName) {
    this.subject.next({
      state,
      type,
      currentId,
      trackName,
      progName,
    });
  }

  sendTime(time) {
    this.time.next({
      time: time
    });
  }

  endTrack(id) {
    this.stop();
    this.removeId.next({
      id: id
    })
  }

  getAction(): Observable<any> {
    return this.subject.asObservable();
  }

  getTime(): Observable < any > {
    return this.time.asObservable();
  }

  trackEnded(): Observable < any > {
    return this.removeId.asObservable();
  }
}
