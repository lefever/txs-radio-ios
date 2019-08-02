import { MusicControls } from '@ionic-native/music-controls/ngx';
import { Loader } from './services/loader';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore } from 'angularfire2/firestore';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { Config } from './services/config';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthenticatorService } from './services/authenticator.service';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { PlaylistPage } from './playlist/playlist.page';
import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    IonicModule.forRoot(),
    AngularFireModule.initializeApp(Config.FIREBASE_CONFIG),
    AppRoutingModule,
    FormsModule,
    IonicStorageModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    StatusBar,
    Facebook,
    PlaylistPage,
    GooglePlus,
    SplashScreen,
    AngularFireDatabase,
    AngularFireAuth,
    AngularFirestore,
    AuthenticatorService,
    GoogleAnalytics,
    Loader,
    Config,
    MusicControls,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
