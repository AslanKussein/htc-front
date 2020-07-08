import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs/index";
import {NotificationService} from "../../../services/notification.service";
import {Util} from "../../../services/util";
import {formatDate} from "@angular/common";
import {AgentService} from "../../../services/agent.service";

@Component({
  selector: 'app-my-agents',
  templateUrl: './my-agents.component.html',
  styleUrls: ['./my-agents.component.scss']
})
export class MyAgentsComponent implements OnInit {
  text: string;
  subscriptions: Subscription = new Subscription();
  constructor(private notifyService: NotificationService,
              private agentService: AgentService,
              private util: Util) { }


  agentData = [];
  loading;
  totalItems = 0;
  itemsPerPage = 10;
  currentPage = 1;

  ngOnInit(): void {
    this.findAgents(1);
  }

  pageChanged(event: any): void {
    if (this.currentPage !== event.page) {
      this.findAgents(event.page);
    }
  }

  findAgents(pageNo: number) {
    this.loading = true;
    let searchFilter = {};

    searchFilter['my'] = true;
    searchFilter['direction'] = 'ASC';
    searchFilter['sortBy'] = 'id';
    searchFilter['text'] = this.text;
    searchFilter['pageNumber'] = pageNo - 1;
    searchFilter['pageSize'] = this.itemsPerPage;
    this.subscriptions.add(this.agentService.getMyAgentList(searchFilter).subscribe(res => {
      this.agentData = res.data.data.data;
      this.totalItems = res.data.total;
      this.currentPage = res.data.pageNumber + 1;
      if(res.data.data.size==0){
        this.notifyService.showInfo('Ничего не найдено!', 'Внимание');
      }
    }));
    this.loading = false;
  }

  getDicNameByLanguage(claim: any, column: string) {
    let x = this.util.getDicNameByLanguage();
    return claim[column]?.name[x];
  }

  formatDate(claim: any) {
    return formatDate(claim.creationDate, 'dd.MM.yyyy HH:mm', 'en-US');
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
