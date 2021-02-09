import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  menu: any = [{
    title: 'Home',
    icon: 'home',
  },
  {
    title: 'Category',
    icon: 'apps',
  },
  {
    title: 'Offers',
    icon: 'pricetag',
  },
  {
    title: 'Favorites',
    icon: 'heart',
  },
  {
    title: 'Popular',
    icon: 'flame',
  },
  {
    title: 'Notification',
    icon: 'notifications'
  }
  ]
  constructor() { }

  menuClick(val: any) {
    console.log(val);
  }

}
