import { Component, OnInit } from '@angular/core';
import {environment} from "../../../environments/environment";
import {User} from "../../models/users";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  year: number;
  currentApplicationVersion = environment.appVersion;
  currentUser: User;

  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.year = new Date().getFullYear();
  }

  ngOnInit(): void {
  }

}
