import { Component, OnInit } from '@angular/core';
import {DicService} from "../services/dic.service";
import {Dic} from "../models/dic";
import {Util} from "../services/util";

@Component({
  selector: 'app-dic-control',
  templateUrl: './dic-control.component.html',
  styleUrls: ['./dic-control.component.scss']
})
export class DicControlComponent implements OnInit {
  users:[];
  dictionary:Dic[];
  constructor(private util: Util,
              private dicService: DicService) { }

  ngOnInit(): void {

  }

  loadDictionary(dic) {
    this.dicService.getDics(dic).subscribe(data => {
      this.dictionary = data;
    });
  }
}
