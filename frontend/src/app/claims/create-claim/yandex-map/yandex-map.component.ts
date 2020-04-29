import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ILoadEvent} from "angular8-yandex-maps";
import {IEvent} from 'angular8-yandex-maps/lib/types/types';


@Component({
  selector: 'app-yandex-map',
  templateUrl: './yandex-map.component.html',
  styleUrls: ['./yandex-map.component.scss']
})
export class YandexMapComponent implements OnInit {

  public  cord: any;

  public placemarkProperties = {
    hintContent: 'Hint content',
    balloonContent: 'Baloon content'
  }

  public placemarkOptions = {
    draggable: true,
    iconLayout: 'default#image',
    iconImageHref: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
    iconImageSize: [32, 32]
  };


  constructor(private  _changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.cord = [55.607637392971306, 36.95529222265626]
  }

  onLoad(event: IEvent) {
    console.log(this.cord);
    const coords = event.event.get('coords');
    this.cord = event.event.get('coords')

    console.log(this.cord);
    this._changeDetectorRef.detectChanges();

  }


}
