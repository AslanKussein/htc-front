import {Component, OnInit} from '@angular/core';
import {Util} from "../services/util";
import {ClientsService} from "../services/clients.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  loading: boolean = false;
  clientsData = [];
  totalItems = 0;
  itemsPerPage = 30;
  currentPage = 1;

  constructor(private util: Util,
              private clientsService: ClientsService) {
  }

  dnHref(href) {
    this.util.dnHref(href);
  }

  ngOnInit(): void {
    this.findClientsData(0);
  }

  pageChanged(event: any): void {
    if (this.currentPage !== event.page) {
      this.findClientsData(event.page);
    }
  }

  getDicNameByLanguage() {
    return this.util.getDicNameByLanguage();
  }

  findClientsData(pageNo: number) {
    this.loading = true;
    let searchFilter = {};
    searchFilter['pageNumber'] = pageNo;
    searchFilter['pageSize'] = this.itemsPerPage;
    this.clientsService.getClientList(searchFilter).subscribe(res => {
      if (res != null && res.data != null && !res.data.data.empty) {
        this.clientsData = res.data.data.data;
        this.totalItems = res.data.totalElements;
        this.itemsPerPage = res.data.size;
        this.currentPage = res.data.number + 1;
      }
    });
    this.loading = false;
  }
}
