import { Component, OnInit } from '@angular/core';
import {Util} from "../../../services/util";
import {ClientsService} from "../../../services/clients.service";

@Component({
  selector: 'app-my-clients',
  templateUrl: './my-clients.component.html',
  styleUrls: ['./my-clients.component.scss']
})
export class MyClientsComponent implements OnInit {

  loading: boolean = false;
  clientsData = [];
  text: string;
  totalItems = 0;
  itemsPerPage = 20;
  currentPage = 1;

  constructor(private util: Util,
              private clientsService: ClientsService,) {
  }

  ngOnInit(): void {
    this.findClientsData(1);
  }

  pageChanged(event: any): void {
    if (this.currentPage !== event.page) {
      this.findClientsData(event.page);
    }
  }

  getDicNameByLanguage() {
    return this.util.getDicNameByLanguage()
  }

  findClientsData(pageNo: number) {
    this.loading = true;
    let searchFilter = {};
    searchFilter['direction'] = 'ASC';
    searchFilter['sortBy'] = 'id';
    searchFilter['my'] = true;
    searchFilter['text'] = this.text;
    searchFilter['pageNumber'] = pageNo - 1;
    searchFilter['pageSize'] = this.itemsPerPage;
    this.clientsService.getClientList(searchFilter).subscribe(res => {
      if (res != null && res.data != null && !res.data.data.empty) {
        this.clientsData = res.data.data.data;
        this.totalItems = res.data.total;
        this.currentPage = res.data.pageNumber + 1;
      }
    });
    this.loading = false;
  }

}
