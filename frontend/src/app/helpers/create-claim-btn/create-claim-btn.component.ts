import {Component, OnInit} from '@angular/core';
import {Util} from "../../services/util";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-claim-btn',
  templateUrl: './create-claim-btn.component.html',
  styleUrls: ['./create-claim-btn.component.scss']
})
export class CreateClaimBtnComponent implements OnInit {

  constructor(private util: Util,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  dnHref(href) {
    this.util.dnHref(href);
  }

  isShow() {
    return this.router.url != '/create-claim'
  }
}
