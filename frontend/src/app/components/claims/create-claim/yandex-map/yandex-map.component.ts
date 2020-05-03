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
  ddd:any;

  public parameters = {
    options: {
      provider: 'yandex#search'
    }
  };

  public placemarkOptions = {
    preset: "twirl#redIcon",
    draggable: true,
    iconImageSize: [32, 32]
  };


  constructor(private  _changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.cord = [51.12, 71.43]
  }

  onLoad(event) {
    this.cord = event.event.get('coords')
    console.log(event)
    // event.instance.geometry.setCoordinates(this.cord);
    this.ddd.geometry.setCoordinates(this.cord);

  }



  onLoad2(event) {
    if(event.type=='dragend'){
      console.log(event)
      this.cord=event.instance.geometry.getCoordinates();
      event.instance.geometry.setCoordinates(this.cord);
    }
    }

  onLoad3(event) {
      this.cord=event.instance.geometry.getCoordinates();
      event.instance.geometry.setCoordinates(this.cord);
      this.ddd=event.instance;

    }

   savecoordinats (){
    let new_coords = [this.cord[0].toFixed(4), this.cord[1].toFixed(4)];

  }


}
