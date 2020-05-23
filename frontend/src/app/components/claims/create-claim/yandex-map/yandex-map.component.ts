import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';


@Component({
  selector: 'app-yandex-map',
  templateUrl: './yandex-map.component.html',
  styleUrls: ['./yandex-map.component.scss']
})
export class YandexMapComponent implements OnInit {

  public cord: any;
  ddd: any;
  search: any;
  modelMap: any;
  streetId: number;

  // @Input()
  // set act(act: any) {
  //   console.log('****************************************')
  //   console.log(act)
  //   this.streetId = act;
  //   // $('#mapSearch').trigger('change');
  //   console.log(this.streetId)
  // }

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
    if (event.type == 'dragend') {
      console.log(event)
      this.cord = event.instance.geometry.getCoordinates();
      event.instance.geometry.setCoordinates(this.cord);
    }
  }

  onLoad3(event) {
    console.log(2)
    this.cord = event.instance.geometry.getCoordinates();
    event.instance.geometry.setCoordinates(this.cord);
    this.ddd = event.instance;

  }

  savecoordinats() {
    let new_coords = [this.cord[0].toFixed(4), this.cord[1].toFixed(4)];

  }

   onControlLoad(event) {
    console.log(66);
    event.instance.search('333');
  }

  searchByStreet(str, event): void {

     console.log(this.ddd);
    // this.search.instance.search(str);
  }

  getEvent(event){
    this.modelMap=event;
  }


  asd() {
    console.log('7789778')
  }



}
