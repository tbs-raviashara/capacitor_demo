import { Admob, AdmobOptions } from '@ionic-native/admob/ngx';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from '@capacitor/core';

const { PushNotifications } = Plugins;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private admob: Admob
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initializePushNotification();
      const admobOptions: AdmobOptions = {
        bannerAdId: 'ca-app-pub-9842356083247596/9235534022',
        interstitialAdId: 'ca-app-pub-9842356083247596~4351050614',
        isTesting: true,
        autoShowBanner: true,
        autoShowInterstitial: true,
        autoShowRewarded: false,
        adSize: this.admob.AD_SIZE.BANNER
      };

      // Set admob options
      this.admob.setOptions(admobOptions)
        .then(() => console.log('Admob options have been successfully set'))
        .catch(err => console.error('Error setting admob options:', err));
    });
  }

  initializePushNotification() {
    if (!localStorage.pushNotificationRegister) {
      PushNotifications.register();
    }

    PushNotifications.addListener('registration',
      (token: PushNotificationToken) => {
        console.log('Push registration success, token: ' + token.value);
        localStorage.pushNotificationRegister = token.value;
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        console.log('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        console.log('Push action performed: ' + JSON.stringify(notification));
      }
    );
  }
}
