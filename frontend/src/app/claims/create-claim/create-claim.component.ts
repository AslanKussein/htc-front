import { Component, OnInit } from '@angular/core';
import {ApplicationDto} from "../../models/applicationDto";
import {Util} from "../../services/util";
import {NotificationService} from "../../services/notification.service";
import * as $ from 'jquery';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-create-claim',
  templateUrl: './create-claim.component.html',
  styleUrls: ['./create-claim.component.scss']
})
export class CreateClaimComponent implements OnInit {

  application: ApplicationDto;
  xVal: string;

  constructor(private util: Util,
              private notifyService : NotificationService,
              private formBuilder: FormBuilder,) {
  }

  applicationForm: any;

  get f(){
    return this.applicationForm.controls;
  }

  ngOnInit(): void {
    this.applicationForm = this.formBuilder.group({
      surname: ['', Validators.required],
      firstName: ['', Validators.required],
      patronymic: ['', Validators.nullValidator],
      clientId: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', Validators.nullValidator],
      operationTypeId: ['', Validators.required],
      objectTypeId: ['', Validators.required],
      objectPrice: ['', Validators.required],
    })
  }

  submit(){
    this.application = this.applicationForm.value;
    console.log(this.application);
  }

  validator() {
    let xResult = true, xColumn, xId;
    if (this.util.isNullOrEmpty(this.application.surname)) {
      xResult = false;
      xColumn = 'surname';
    }
    if (!xResult) {
      $("#" + xColumn).focus();
      this.xVal = xColumn;
      this.notifyService.showError("Ошибка", "Поле " + xColumn + " не заполнено!!!")
      return xResult;
    }
  }

}
