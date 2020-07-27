import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {NgxUiLoaderService} from "ngx-ui-loader";
import {NotificationService} from "../../services/notification.service";
import {StaffService} from "../../services/staff.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {Util} from "../../services/util";
import {Subscription} from "rxjs/index";
import {Dic} from "../../models/dic";
import {User} from "../../models/users";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit, OnDestroy {
  modalRef: BsModalRef;
  actions: string;
  currentUser: User;
  admRoles: boolean;

  subscriptions: Subscription = new Subscription();

  constructor(private modalService: BsModalService,
              private staffService: StaffService,
              private notifyService: NotificationService,
              private authenticationService: AuthenticationService,
              private util: Util,
              private ngxLoader: NgxUiLoaderService) {
    this.subscriptions.add(this.authenticationService.currentUser.subscribe(x => this.currentUser = x));
    if (this.currentUser.roles != null) {
      this.admRoles = false;
      for (const role of this.currentUser.roles) {
        if (role == 'Administrator resursa') {
          this.admRoles = true;
        }
      }

    }


  }

  ngOnInit(): void {
    this.findObjects(1);
  }

  users = [];
  organizations = [];
  organizationsDic: Dic[];
  loading;
  totalItems = 0;
  itemsPerPage = 10;
  currentPage = 1;

  pageChanged(event: any): void {
    if (this.currentPage !== event.page) {
      this.findObjects(event.page);
    }
  }

  findObjects(pageNo: number) {
    this.ngxLoader.start();
    let searchFilter = {};

    this.loading = true;
    searchFilter['pageNumber'] = pageNo;
    searchFilter['pageSize'] = this.itemsPerPage;
    this.subscriptions.add(
      this.staffService.getOrganizationList().subscribe(data => {
        this.organizations = data;
        this.organizationsDic = this.util.toSelectArrayOrganization(data);
        ;
      })
    );
    this.loading = false;
    this.ngxLoader.stop();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  filter = {
    search: ''
  }


  organization = {
    organizationId: null
  }

  formData = {
    id: null,
    nameKk: null,
    nameRu: null,
    nameEn: null,
    bin: null,
    addressKk: null,
    addressRu: null,
    addressEn: null,
    phoneNumber: null,
    email: null,
    requisiteDto: {
      account: null,
      additionally: null,
      bik: null,
      bin: null,
      name: null,
    }
  };

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {backdrop: 'static', keyboard: false});
  }

  openModal2(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg', backdrop: 'static', keyboard: false});
  }

  delData(org: any) {
    this.organization.organizationId = org.id;
    this.getUserInfo();
  }

  deleteOrg(users) {
    let delet = true;
    if (!this.util.isNullOrEmpty(users)) {
      this.ngxLoader.start();
      for (let i = 0; i < users.length; i++) {
        if (users[i].organizationId == this.organization.organizationId) {
          this.notifyService.showError('warning', 'Вы не определили сотрудника ' + users[i].name + ' ' + users[i].surname);
          delet = false;
        } else {
          this.subscriptions.add(this.staffService.updateOrganizationById(users[i])
            .subscribe(data => {
              if (data != null) {
                this.notifyService.showSuccess('success', 'Успешно сохранено');
              }
            }, err => {
              this.notifyService.showError('warning', err.message);
            }));
        }

      }
      if (delet == false) {
        this.findObjects(1);
        this.modalRef.hide();
        this.users = null;
      }
      this.ngxLoader.stop();
    }
    if (delet == true) {
      this.subscriptions.add(this.staffService.deleteOrganization(this.organization.organizationId).subscribe(data => {
          this.notifyService.showSuccess('success', 'Успешно сохранено');

          this.findObjects(1);
          this.modalRef.hide();
          this.users = null;
        }
        , err => {
          this.notifyService.showError('warning', err.message);
          this.findObjects(1);
          this.modalRef.hide();
          this.users = null;
        }
        )
      )
    }

  }

  editData(org: any) {
    this.actions = 'EDIT';
    this.staffService.getOrganizationById(org)
      .subscribe(data => {
        console.log(data)
        this.formData = data;
        if (data.requisiteDto == null) {
          this.formData = {
            id: data.id,
            nameKk: data.nameKk,
            nameRu: data.nameRu,
            nameEn: data.nameEn,
            bin: data.bin,
            addressKk: data.addressKk,
            addressRu: data.addressRu,
            addressEn: data.addressEn,
            phoneNumber: data.phoneNumber,
            email: data.email,
            requisiteDto: {
              account: null,
              additionally: null,
              bik: null,
              bin: null,
              name: null,
            }
          }
        }
        console.log(this.formData)


      });
  }

  addOrg() {
    this.actions = 'ADD';
    this.formData = {
      id: null,
      nameKk: null,
      nameRu: null,
      nameEn: null,
      bin: null,
      addressKk: null,
      addressRu: null,
      addressEn: null,
      phoneNumber: null,
      email: null,
      requisiteDto: {
        account: null,
        additionally: null,
        bik: null,
        bin: null,
        name: null
      }
    };
  }

  submit() {
    if (this.util.isNullOrEmpty(this.formData.nameKk) || this.util.isNullOrEmpty(this.formData.nameRu)
      || this.util.isNullOrEmpty(this.formData.nameEn) || this.util.isNullOrEmpty(this.formData.bin)
      || this.util.isNullOrEmpty(this.formData.addressKk) || this.util.isNullOrEmpty(this.formData.addressRu)
      || this.util.isNullOrEmpty(this.formData.addressEn) || this.util.isNullOrEmpty(this.formData.requisiteDto.name)
      || this.util.isNullOrEmpty(this.formData.requisiteDto.account)
      || this.util.isNullOrEmpty(this.formData.requisiteDto.bin)
      || this.util.isNullOrEmpty(this.formData.requisiteDto.bik)) {
      this.notifyService.showError('Пожалуйста, заполните обязательные поля', "");
      return;
    }
    this.ngxLoader.start();
    if (this.actions == 'EDIT') {
      this.subscriptions.add(this.staffService.updateOrganization(this.formData)
        .subscribe(data => {
          if (data != null) {
            this.notifyService.showSuccess('success', 'Успешно сохранено');
            this.findObjects(1);
            this.modalRef.hide();
          }
        }, err => {
          this.notifyService.showError('warning', err.message.ru);
          this.findObjects(1);
          this.modalRef.hide();
        }));
    }
    if (this.actions == 'ADD') {
      this.subscriptions.add(this.staffService.createOrganization(this.formData)
        .subscribe(data => {
          if (data != null) {
            this.notifyService.showSuccess('success', 'Успешно сохранено');
            this.findObjects(1);
            this.modalRef.hide();
          }
        }, err => {
          console.log(err)
          if (err == 'User with Login = test already exists') {
            this.notifyService.showError('Логин уже зарегистрирован', "");
          } else if (err == 'User with FIO = test test already exists') {
            this.notifyService.showError('Пользователь с таким ФИО уже зарегистрирован', "");
          } else {
            this.notifyService.showError('warning', err.ru);
          }
          this.findObjects(1);
          this.modalRef.hide();
        }));
    }
    this.ngxLoader.stop();
  }


  getUserInfo() {
    this.ngxLoader.start();
    this.subscriptions.add(this.staffService.getUserInfo(this.organization).subscribe(res => {
        if (res != null) {
          this.users = res.data;
        }
      },
      () => {
        this.users = null;
      }
    ));
    this.ngxLoader.stop();
  }
}
