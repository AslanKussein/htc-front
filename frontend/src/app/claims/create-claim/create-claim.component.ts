import { Component, OnInit } from '@angular/core';
import {ApplicationDto} from "../../models/applicationDto";

@Component({
  selector: 'app-create-claim',
  templateUrl: './create-claim.component.html',
  styleUrls: ['./create-claim.component.scss']
})
export class CreateClaimComponent implements OnInit {

  application: ApplicationDto;

  constructor() {
  }

  ngOnInit(): void {
  }

}
