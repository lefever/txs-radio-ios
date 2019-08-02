import {
  MusicControls
} from '@ionic-native/music-controls/ngx';
import {
  Injectable
} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MusicControlsService {

  constructor(
    private musicControls: MusicControls,
  ) {}

  public showNotification(programa, titulo, thumb) {
    this.musicControls.create({
      track: titulo, // optional, default : ''
      artist: programa, // optional, default : ''
      cover: thumb, // optional, default : nothing
      isPlaying: true, // optional, default : true
      dismissable: false, // optional, default : false

      // hide previous/next/close buttons:
      hasPrev: false, // show previous button, optional, default: true
      hasNext: false, // show next button, optional, default: true
      hasClose: false, // show close button, optional, default: false

      // iOS only, optional
      hasSkipForward: true, // show skip forward button, optional, default: false
      hasSkipBackward: true, // show skip backward button, optional, default: false
      skipForwardInterval: 15, // display number for skip forward, optional, default: 0
      skipBackwardInterval: 15, // display number for skip backward, optional, default: 0
      hasScrubbing: false, // enable scrubbing from control center and lockscreen progress bar, optional

      // Android only, optional
      // text displayed in the status bar when the notification (and the ticker) are updated, optional
      ticker: 'Now playing "Time is Running Out"',
      // All icons default to their built-in android equivalents
      playIcon: 'media_play',
      pauseIcon: 'media_pause',
      prevIcon: 'media_prev',
      nextIcon: 'media_next',
      closeIcon: 'media_close',
      notificationIcon: 'notification'
    });

    this.musicControls.subscribe().subscribe(action => {

      switch (action) {
        case 'music-controls-next':
          // Do something
          break;
        case 'music-controls-previous':
          // Do something
          break;
        case 'music-controls-pause':
          console.log('Pause');
          break;
        case 'music-controls-play':
          // Do something
          break;
        case 'music-controls-destroy':
          // Do something
          console.log('Destroy');
          break;

          // External controls (iOS only)
        case 'music-controls-toggle-play-pause':
          // Do something
          break;
        case 'music-controls-seek-to':
          const seekToInSeconds = JSON.parse(action).position;
          this.musicControls.updateElapsed({
            elapsed: seekToInSeconds,
            isPlaying: true
          });
          // Do something
          break;
        case 'music-controls-skip-forward':
          // Do something
          break;
        case 'music-controls-skip-backward':
          // Do something
          break;

          // Headset events (Android only)
          // All media button events are listed below
        case 'music-controls-media-button':
          // Do something
          break;
        case 'music-controls-headset-unplugged':
          // Do something
          break;
        case 'music-controls-headset-plugged':
          // Do something
          break;
        default:
          break;
      }

      this.musicControls.listen(); // activates the observable above

      this.musicControls.updateIsPlaying(true);


    });
  }
}