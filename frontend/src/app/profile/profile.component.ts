import { Component, OnInit } from '@angular/core';
import {Util} from "../services/util";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private util: Util) { }

  dnHref(href) {
    this.util.dnHref(href);
  }

  ngOnInit(): void {
  }

}
