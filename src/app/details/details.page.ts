import { BLE } from '@ionic-native/ble/ngx';
import { Component, NgZone, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  peripheral: any = {};
  statusMessage: string;
  constructor(private ble: BLE,
    private toastCtrl: ToastController,
    private ngZone: NgZone,
    public router: Router) {
    if (router.getCurrentNavigation().extras.state) {
      const device = router.getCurrentNavigation().extras.state;
      console.log(device);
      this.setStatus('Connecting to ' + device.name || device.id);
      this.ble.connect(device.id).subscribe(
        peripheral => this.onConnected(peripheral),
        peripheral => this.onDeviceDisconnected(peripheral)
      );
    }
  }

  ngOnInit() {
  }

  onConnected(peripheral: any) {
    console.log('peripheral', peripheral);
    this.ngZone.run(() => {
      this.setStatus('');
      this.peripheral = peripheral;
    });

    this.peripheral = peripheral;
    this.setStatus('Connected to ' + (peripheral.name || peripheral.id));

    // starting to get notification for each notified data on given characterstic id 
    this.ble.startNotification(this.peripheral.id, 'SERVICE_ID', 'CHARACTERSITC_ID').subscribe(
      data => this.onDataChange(data)
    )

    // Read the current value of the characteristic
    this.ble.read(this.peripheral.id, 'SERVICE_ID', 'CHARACTERSITC_ID').then(
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
      () => console.log('Disconnected ', this.peripheral),
      () => console.log('ERROR disconnecting', this.peripheral));
  }

  setStatus(message: any) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

}
