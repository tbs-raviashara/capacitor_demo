import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeyboardInfo, Plugins } from '@capacitor/core';
import { catchError, map } from 'rxjs/operators';
const { Device, Network, Toast, Keyboard } = Plugins;
import { throwError } from 'rxjs';
import { PopoverController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {

  constructor(public http: HttpClient, public popoverController: PopoverController) {
    Network.addListener('networkStatusChange', (status) => {

      // Toast.show({
      //   text: `You are now ${status.connected ? 'Online' : 'Offline'}`,
      //   duration: 'long'
      // });

      // Keyboard.addListener('keyboardWillShow', (info: KeyboardInfo) => {
      //   console.log('keyboard will show with height', info.keyboardHeight);
      // });

      // Keyboard.addListener('keyboardWillHide', () => {
      //   console.log('keyboard will hide');
      // });

    });
  }

  async getDeviceData() {
    const info = await Device.getInfo();
    console.log(info);
  }

  public callAPI(method: any, url: any, params: any, isQueryString: any) {
    let headers = new HttpHeaders();
    if (isQueryString) {
      headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
      params = this.GetJsonToQueryString(params);
    }

    if (localStorage.token != undefined && url !== 'token') {
      headers = headers.append('Authorization', localStorage.token);
    }

    if (method === 'GET') {
      return this.http.get(url).pipe(
        map(response => {
          return response;
        }),
        catchError(this.handleError));
    } else {
      return this.http.post(url, params, { headers }).pipe(
        map(response => {
          return response;
        }),
        catchError(this.handleError));
    }
  }

  handleError(error: HttpErrorResponse) {
    console.log("handleError", error);
    return throwError(error);
  }

  GetJsonToQueryString(params) {
    let formBody: any = [];
    for (const property in params) {
      const encodedKey = property;
      const encodedValue = params[property];
      formBody.push(encodedKey + '=' + encodedValue);
    }
    return (formBody = formBody.join('&'));
  }
}
