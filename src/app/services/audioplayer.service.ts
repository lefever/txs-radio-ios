import { Platform } from '@ionic/angular';
import { MusicControlsService } from './music-controls.service';
import { Injectable, EventEmitter, Output, Input } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';

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
    public musicControl: MusicControlsService,
    private platform: Platform,
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
      this.trackDuration = event.path[0].duration;
      console.log(event);
    });

    // Cambio en el tiempo
    this.audioPlayer.addEventListener('timeupdate', (event) => {
      this.knobPosition = (event.path[0].currentTime / event.path[0].duration) * 100;
      this.sendTime(this.knobPosition);
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
      console.log(event);
      this.sendAction('Live', type, id, info, prog);
    }, false);

    // Cargando
    this.audioPlayer.addEventListener('waiting', (event) => {
      this.isPlaying = false;
      this.sendAction('Cargando', type, id, info, prog);
      console.log(event);
    }, false);

    // Reproduciendo
    this.audioPlayer.addEventListener('playing', (event) => {
      this.playerStatus = 'Live';
      this.isPlaying = true;
      this.sendAction('Live', type, id, info, prog);
      console.log(event);
      console.log(event.path[0].duration);
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
    if (this.isPlaying){
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
      time
    });
  }

  endTrack(id) {
    this.removeId.next({
      id
    });
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
