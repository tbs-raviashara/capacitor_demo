import { BLE } from '@ionic-native/ble/ngx';
import { Component, NgZone } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public devices: any = [];
  public statusMessage: any;
  public isScanOn: boolean = false;
  constructor(public navCtrl: NavController,
    private ble: BLE,
    private ngZone: NgZone,
    private toastCtrl: ToastController) { }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
    this.scan();
  }

  scan() {
    this.isScanOn = !this.isScanOn;
    if (this.isScanOn) {
      this.setStatus("Scanning for Bluetooth LE Devices");
      this.devices = []; // clear list

      this.ble.scan([], 5).subscribe(
        device => this.onDeviceDiscovered(device),
        error => this.scanError(error)
      );

      setTimeout(this.setStatus.bind(this), 5000, "Scan complete");
    }
  }

  onDeviceDiscovered(device: any) {
    console.log("Discovered " + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      this.devices.push(device);
    });
  }

  // If location permission is denied, you'll end up here
  async scanError(error: any) {
    this.setStatus("Error " + error);
    let toast = await this.toastCtrl.create({
      message: "Error scanning for Bluetooth low energy devices",
      position: "middle",
      duration: 5000
    });
    toast.present();
  }

  setStatus(message: any) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

  clickToConnect(val: any) {
    console.log(val);
    this.navCtrl.navigateForward('details', { state: val })
  }

}
