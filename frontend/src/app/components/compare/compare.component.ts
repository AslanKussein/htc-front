import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {

  constructor() {
  }

  arrayOfKeys;
  arrayOfValues;
  datas: any;
  names: any;
  sortArr: any = [];
  finalArr: any = [];

  ngOnInit(): void {
    this.names = [{
      name: "oper",
      value: "Операция"
    }, {
      name: "type",
      value: "Тип объекта"
    },
      {
        name: "price",
        value: "Цена объекта (млн.тг)"
      },
      {
        name: "ipoteka",
        value: "Ипотека"
      },
      {
        name: "sobstv",
        value: "Общая долевая собственность"
      },
      {
        name: "obremen",
        value: "Обременение"
      },
      {
        name: "obmen",
        value: "Обмен"
      },
      {
        name: "verTorg",
        value: "Вероятность торга"
      },
      {
        name: "razmTorg",
        value: "Размер торга"
      },
      {
        name: "prichTor",
        value: "Возможные причины торга"
      },
      {
        name: "comment",
        value: "Комментарий"
      },
      {
        name: "NumDog",
        value: "Номер договора"
      },
      {
        name: "srokDeistDog",
        value: "Срок действия договора"
      },
      {
        name: "SrokPoDog",
        value: "Срок по договору"
      },
      {
        name: "Komis",
        value: "Комиссия включена в стоимость?"
      },
    ];


    this.datas=[
      { oper:"Продать",
      type:"Квартира",
      price:"20,3",
      ipoteka:"Да",
      sobstv:"Да",
      obremen:"Нет",
      obmen:"Нет",
      verTorg:"Да",
      razmTorg:"100 000",
      prichTor:"Оплата наличными",
      comment:"Продам в отл сост",
      NumDog:"123",
      srokDeistDog:"01.01.2021",
      SrokPoDog:"100 000",
      Komis:"Нет",
    },
      { oper:"Купить",
        type:"Дом",
        price:"19",
        ipoteka:"Да",
        sobstv:"",
        obremen:"",
        obmen:"",
        verTorg:"Да",
        razmTorg:"500 000",
        prichTor:"",
        comment:"Куплю квартиру в отл сост",
        NumDog:"1233",
        srokDeistDog:"01.01.2021",
        SrokPoDog:"500 000",
        Komis:"Да",},

    ];
  }

  compareClear(){
    this.finalArr=[]
  }

  compare() {
    this.sortArr=[];
    this.finalArr=[];
    for (const arr of this.datas) {
      let ss = Object.values(arr);
      let sss = Object.keys(arr);
      for (let i = 0; i < ss.length; i++) {
        this.sortArr[i] = this.sortArr[i] || [];
        this.sortArr[i].push(ss[i] , sss[i]);
      }
    }
    for (const sort of this.sortArr) {
      const sortLength = sort.length;
      let item0: any;
      let item2: any;
      for (let i = 0; i < sortLength; i++) {
        if(i==0){
          item0=sort[i];
        }
        if(i==1){
          item2=sort[i];
        }

        if(i==2){
          if (JSON.stringify(item0) !== JSON.stringify(sort[i])){
            this.finalArr.push(item2)
          }
        }
      }
    }
    }

  getCompareByKey(key){
    for (let i = 0; i<this.finalArr.length;i++){
      if (this.finalArr[i]===key){
        return true;
      }
    }
    return false;
  }


}
