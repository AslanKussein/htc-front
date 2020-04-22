import {Component, OnInit, TemplateRef} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {DicService} from "../services/dic.service";
import {Dic} from "../models/dic";
import {Util} from "../services/util";
import {ruLocale} from "ngx-bootstrap/locale";
import {defineLocale} from "ngx-bootstrap/chronos";
import {BsLocaleService} from "ngx-bootstrap";
import {StaffService} from "../services/staff.service";
import {NotificationService} from "../services/notification.service";


@Component({
  selector: 'app-staffs',
  templateUrl: './staffs.component.html',
  styleUrls: ['./staffs.component.scss']
})
export class StaffsComponent implements OnInit {
  modalRef: BsModalRef;
  residentialComplexes: Dic[];
  roles: Dic[];
  groups: Dic[];
  actions:string;

  constructor(private modalService: BsModalService,
              private localeService: BsLocaleService,
              private dicService: DicService,
              private staffService: StaffService,
              private notifyService: NotificationService,
              private util: Util) {
    defineLocale('ru', ruLocale);
    this.localeService.use('ru');
  }
  search:'';


  formData={
    residentialComplexes:null,
    roles:null,
    groups:null,
    isActive:true,
    login:null,
    pass:'',
    passNew:'',
    passNew2:'',
    name:'',
    surname:''};


  ngOnInit(): void {
    this.loadDictionary();
    this.findObjects(1);
    this.getUserInfo();
  }

  users = [];
  loading;
  totalItems = 0;
  itemsPerPage = 10;
  currentPage = 1;


  pageChanged(event: any): void {
    if (this.currentPage !== event.page) {
      this.findObjects(event.page);
    }
  }

  getUserInfo(){
    this.staffService.getUserInfo(this.search).subscribe(res => {

      if (res != null) {
        this.users = res.data;
        console.log(this.users)
      }
    });

  }

  findObjects(pageNo: number) {
    let searchFilter = {};

    this.loading = true;
    console.log('formData.lastModifyDateRange', this.formData)
    searchFilter['pageNumber'] = pageNo;
    searchFilter['pageSize'] = this.itemsPerPage;
    this.staffService.getUserList(searchFilter).subscribe(res => {

      if (res != null) {
        this.users = res.data;
        console.log(this.users)
        }
    });
    this.loading = false;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  loadDictionary() {
    this.dicService.getDics('residentialComplexes').subscribe(data => {
      this.residentialComplexes = this.util.toSelectArrayResidenceComplex(data);
    });


    this.staffService.getRoleList('roles').subscribe(data => {
      this.roles = this.util.toSelectArrayRoles2(data);
    });

    this.staffService.getGroupList('groups').subscribe(data => {
      this.groups = this.util.toSelectArrayRoles2(data);
    });
  }

  delUser(obj){

  }

  submit() {
    if (this.actions=='EDIT'){

      this.staffService.updateUserRolesById(this.formData)
        .subscribe(data => {
          if (data != null) {
            this.notifyService.showSuccess('success', 'Успешно сохранено');
            this.findObjects(1);
            this.modalRef.hide();
          }
        }, err => {
          this.notifyService.showError('warning', err.message);
          this.findObjects(1);
          this.modalRef.hide();
        });

      this.staffService.updateUserActiveById(this.formData)
        .subscribe(data => {
          if (data != null) {
            this.notifyService.showSuccess('success', 'Успешно сохранено');
          }
        }, err => {
          this.notifyService.showError('warning', err.message);
          this.findObjects(1);
          this.modalRef.hide();
        });

      if (this.formData.passNew !='' && this.formData.passNew2 !=''){
        if(this.formData.passNew !=null && this.formData.passNew2 !=null){
          if(this.formData.passNew==this.formData.passNew2){
            this.staffService.updatePasswordById(this.formData)
              .subscribe(data => {
                if (data != null) {
                  this.notifyService.showSuccess('success', 'Успешно сохранено');
                }
              }, err => {
                this.notifyService.showError('warning', err.message);
                this.findObjects(1);
                this.modalRef.hide();
              });
          }
        }

      }



      }
    if (this.actions=='ADD'){
      this.staffService.createUser(this.formData)
        .subscribe(data => {
          if (data != null) {
            this.notifyService.showSuccess('success', 'Успешно сохранено');
            this.findObjects(1);
            this.modalRef.hide();
          }
        }, err => {
          this.notifyService.showError('warning', err.message);
          this.findObjects(1);
          this.modalRef.hide();
        });
    }

  }

  editData(user: any){
    this.actions='EDIT';
    this.staffService.getUserById(user)
      .subscribe(data => {
        this.formData=data;
      });
  }

  addUser(){
    this.actions='ADD';
    this.formData={
      residentialComplexes:null,
      roles:null,
      groups:null,
      isActive:true,
      login:null,
      pass:'',
      passNew:'',
      passNew2:'',
      name:'',
      surname:''};

  }


}
