import { Component, OnInit } from '@angular/core';
import {ApplicationDto} from "../../models/applicationDto";
import {Util} from "../../services/util";
import {NotificationService} from "../../services/notification.service";
import * as $ from 'jquery';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ClaimService} from "../../services/claim.service";

@Component({
  selector: 'app-create-claim',
  templateUrl: './create-claim.component.html',
  styleUrls: ['./create-claim.component.scss']
})
export class CreateClaimComponent implements OnInit {

  application: ApplicationDto;
  xVal: string;

  constructor(private util: Util,
              private notifyService: NotificationService,
              private formBuilder: FormBuilder,
              private claimService: ClaimService) {
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

    // this.loading = true;
    this.claimService.saveClaim(this.application)
      .subscribe(data => {
        if (data != null) {
          // this.resumeModel = data;
          this.notifyService.showSuccess('success', 'Успешно сохранено');
        }
      }, err => {
        this.notifyService.showError('warning', err.message);
      });
    // this.loading = false;
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
