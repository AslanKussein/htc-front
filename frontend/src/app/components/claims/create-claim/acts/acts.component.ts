import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-acts',
  templateUrl: './acts.component.html',
  styleUrls: ['./acts.component.scss']
})
export class ActsComponent implements OnInit {

  constructor(private actRoute: ActivatedRoute) { }

  ngOnInit(): void {
  }

}
