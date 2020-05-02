import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fortebank-api',
  templateUrl: './fortebank-api.component.html',
  styleUrls: ['./fortebank-api.component.scss']
})
export class FortebankApiComponent implements OnInit {

  transactionSourcePurchase: any;
  ecomInitConfig: any;

  constructor() {
    this.transactionSourcePurchase = {id: 123}
    this.ecomInitConfig = {orderId: 123, sessionId: 1234}
  }
  ngOnInit(): void {
  }

}
