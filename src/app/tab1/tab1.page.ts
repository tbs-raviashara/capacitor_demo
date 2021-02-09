import { PopupPage } from './../popup/popup.page';
import { ApiCallService } from './../services/apiCall/api-call.service';
import { Component } from '@angular/core';
import { ActionSheetOptionStyle, Camera, CameraResultType, CameraSource, Capacitor, Plugins } from '@capacitor/core';
const { App, Browser, Modals, Share, FacebookLogin } = Plugins;
import { FacebookLoginResponse } from '@rdlabo/capacitor-facebook-login';
import { Base64 } from '@ionic-native/base64/ngx';

import '@codetrix-studio/capacitor-google-auth';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(public service: ApiCallService, private base64: Base64) { }

  async click() {
    console.log(Capacitor.getPlatform());
    const image = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      quality: 100,
    });

    console.log(image);
  }

  async clickBrowser() {
    await Browser.open({ url: 'http://capacitorjs.com/', windowName: '_system', presentationStyle: 'fullscreen' });
  }

  async getAlert() {
    let confirmRet = await Modals.confirm({
      title: 'Confirm',
      message: 'Are you sure you\'d like to press the red button?',
      okButtonTitle: 'Exit',
      cancelButtonTitle: 'Dismiss'
    });
    if (confirmRet.value) {
      App.exitApp();
    }
    console.log('Confirm ret', confirmRet.value);
  }

  async shareData() {
    await Share.share({
      title: 'See cool stuff',
      text: 'Really awesome thing you need to see right meow',
      url: 'http://ionicframework.com/',
      dialogTitle: 'Share with buddies'
    });
  }

  async showActionSheet() {
    let promptRet = await Modals.showActions({
      title: 'Photo Options',
      message: 'Select an option to perform',
      options: [
        {
          title: 'Upload'
        },
        {
          title: 'Share'
        },
        {
          title: 'Remove',
          style: ActionSheetOptionStyle.Default,
          icon: 'Add'
        },
        {
          title: 'Cancel',
          style: ActionSheetOptionStyle.Cancel
        }
      ],
    });

    console.log(promptRet);
  }

  async loginFacebook() {
    if (localStorage.isLogin) {
      const result_accessToken = await Plugins.FacebookLogin.getCurrentAccessToken();
      console.log(result_accessToken);
    } else {
      const FACEBOOK_PERMISSIONS = ['email', 'user_birthday', 'user_photos', 'user_gender'];
      const result = await <FacebookLoginResponse>FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });
      if (result.accessToken) {
        // Login successful.
        localStorage.isLogin = true;
        console.log(`Facebook access token is ${result.accessToken.token}`);
      } else {
        // Cancelled by user.
      }
    }
  }

  logoutFacebook() {
    Plugins.FacebookLogin.logout();
    localStorage.removeItem('isLogin');
  }

  async googleSignup() {
    const googleUser = await Plugins.GoogleAuth.signIn(null) as any;
    console.log('my user: ', googleUser);
  }

  convertBase64() {
    this.base64.encodeFile("https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2697409723923048&height=50&width=50&ext=1612419102&hash=AeR2fMueMVDYDE0jp5c").then((base64File: string) => {
      console.log(base64File);
    }, (err) => {
      console.log(err);
    });
  }

  showPopup() {
    this.service.popoverController.create({
      animated: true,
      component: PopupPage,
      translucent: true,
      cssClass: 'settingPopover iconForm',
      mode: 'ios',
      backdropDismiss: false
    }).then((popover: any) => {
      popover.present();
      popover.onDidDismiss().then((callBackVal: any) => {
        console.log(callBackVal);
      });
    });
  }
}
