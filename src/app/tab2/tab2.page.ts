import { BLE } from '@ionic-native/ble/ngx';
import { Component, NgZone } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public isConnected: boolean = false;
  public devices: any = [];
  public statusMessage: any;
  public isScanOn: boolean = false;
  public peripheral: any = {};
  constructor(public navCtrl: NavController,
    private ble: BLE,
    private ngZone: NgZone,
    private toastCtrl: ToastController) { }

  ionViewDidEnter() {
    this.ble.isEnabled().then((item: any) => {
      this.scan();
    }).catch(async (item: any) => {
      let toast = await this.toastCtrl.create({
        message: "Bluetooth is disabled.",
        position: "top",
        duration: 5000
      });
      toast.present();
    });
  }

  scan() {
    this.isScanOn = !this.isScanOn;
    if (this.isScanOn) {
      this.setStatus("Scanning for Bluetooth LE Devices");
      this.devices = []; // clear list

      this.ble.scan([], 10).subscribe(
        device => this.onDeviceDiscovered(device),
        error => this.scanError(error)
      );

      setTimeout(this.setStatus.bind(this), 10000, "Scan complete");
    } else {
      if (this.isConnected) {
        this.ionViewWillLeave();
      }
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
    console.log('clickToConnect', val);
    this.setStatus('Connecting to ' + val.name || val.id);
    this.ble.connect(val.id).subscribe(
      peripheral => this.onConnected(peripheral),
      peripheral => this.onDeviceDisconnected(peripheral)
    );
  }

  onConnected(peripheral: any) {
    console.log('peripheral', peripheral);
    this.isConnected = true;
    this.ngZone.run(() => {
      this.setStatus('');
      this.peripheral = peripheral;
    });

    this.peripheral = peripheral;
    this.setStatus('Connected to ' + (peripheral.name || peripheral.id));

    // starting to get notification for each notified data on given characterstic id 
    this.ble.startNotification(this.peripheral.id, 'FF10', 'FF11').subscribe(
      data => this.onDataChange(data)
    )

    // Read the current value of the characteristic
    this.ble.read(this.peripheral.id, 'FF10', 'FF11').then(
      data => this.onReadData(data)
    )
  }

  onDataChange(buffer: ArrayBuffer) {
    var data = new Uint8Array(buffer);
    // You will get the notification data here
    console.log(data);
  }

  onReadData(buffer: ArrayBuffer) {
    var data = new Uint8Array(buffer);
    // You will get the read data here
    console.log(data);
  }

  onDeviceDisconnected(peripheral: any) {
    this.toastCtrl.create({
      message: 'The peripheral unexpectedly disconnected',
      duration: 3000,
      position: 'bottom'
    }).then((toast: any) => {
      toast.present();
    });

  }

  // Disconnect peripheral when leaving the page
  ionViewWillLeave() {
    console.log('ionViewWillLeave disconnecting Bluetooth');
    this.ble.disconnect(this.peripheral.id).then(
      () => {
        console.log('Disconnected ', this.peripheral)
        this.setStatus('Disconnected to ' + (this.peripheral.name || this.peripheral.id));
        this.isConnected = false;
      },
      () => console.log('ERROR disconnecting', this.peripheral));
  }
}
