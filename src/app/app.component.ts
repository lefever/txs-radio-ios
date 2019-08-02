import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AudioPlayerService } from './services/audio-player.service';
import { MusicControl } from './services/music-control.service';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { Subscription } from 'rxjs';
import { PlaylistPage } from './playlist/playlist.page';
import { PlaylistService } from './services/playlist.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    {
      title: 'Chat',
      url: '/home',
      icon: 'chatbubbles'
    },
    {
      title: 'Video',
      url: '/video',
      icon: 'tv'
    },
    {
      title: 'Podcast',
      url: '/podcast',
      icon: 'microphone'
    },
    {
      title: 'Cápsulas',
      url: '/capsulas',
      icon: 'recording'
    },
    {
      title: 'Playlist',
      url: '/playlist',
      icon: 'list'
    },
    {
      title: 'Mi perfil',
      url: '/login',
      icon: 'person'
    }
  ];

  // Player variables
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

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private playerService: AudioPlayerService,
    private musicControl: MusicControl,
    private ga: GoogleAnalytics,
    private playlistService: PlaylistService
  ) {
    this.initializeApp();
    // if (!this.playlistService.queuedTracks.length || this.playlistService.queuedTracks === null) {
    //   this.playlistService.queuedTracks = [];
    //   console.log(this.playlistService.queuedTracks);
    // } else {
    //   this.playlistService.populateArray();
    //   console.log(this.playlistService.queuedTracks);
    // }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      if (this.platform.is('cordova')) {
        this.showInfo();
        this.initGa();
      }
    });
    this.subscription = this.playerService.getAction().subscribe(action => {
      this.playerStatus = action.state;
      this.streamType = action.type;
      this.currentId = action.id;
      this.currentProg = action.progName;
      this.currentTrack = action.trackName;
    });
    this.currentTime = this.playerService.getTime().subscribe(time => {
      if (!this.seeking){
        this.currentTime = time.time;
      }
    });
  }

  play(url, type, info, id, prog, thumb) {
    if (this.playerStatus === 'Paused') {
      this.playerService.resume();
    } else {
      this.playerService.stop();
      this.playerService.play(url, type, info, id, prog, thumb);
    }
  }

  pause() {
    this.playerService.pause();
  }

  stop() {
    this.playerService.stop();
  }

  showInfo(){
    this.musicControl.showNotification('TXS Radio', 'Ciencia y tecnología', 'assets/imgs/logo.png');
  }

  initGa(){
    this.ga.startTrackerWithId('UA-139395569-1').then(() => {}).catch(e => alert('Error starting GoogleAnalytics == ' + e));
  }

  seekStart(event) {
    this.seeking = true;
    console.log(this.seeking);
  }

  seekEnd(event) {
    console.log(event.target.value);
    event = event.target.value;
    this.seeking = false;
    this.playerService.seek(event);
    // this.playerService.currentTime = event.target.currentTime;
  }

  trackRadioPlay() {
    if (this.platform.is('cordova')) {
      this.ga.trackEvent('App', 'Radio', 'Play', 0);
    }
  }

}
