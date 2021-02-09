import { ApiCallService } from './../services/apiCall/api-call.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.page.html',
  styleUrls: ['./popup.page.scss'],
})
export class PopupPage implements OnInit {

  constructor(public service: ApiCallService) { }

  ngOnInit() {
  }

  onClick(val?: any) {
    this.service.popoverController.dismiss(val);
  }
}
