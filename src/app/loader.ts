import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

/*
  Generated class for the Loader provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Loader {

  loader: any;
  constructor(private loading: LoadingController) {
    console.log('Hello Loader Provider');
  }

  show(message) {
    this.loading.create({ message: message }).then(alert => alert.present());
  }

  hide() {
    this.loading.dismiss();
  }

}
