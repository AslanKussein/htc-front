import {Component, OnDestroy, OnInit} from '@angular/core';
import {Util} from "../../services/util";
import {User} from "../../models/users";
import {AuthenticationService} from "../../services/authentication.service";
import {ProfileService} from "../../services/profile.service";
import {ProfileDto} from "../../models/profile/profileDto";
import {UploaderService} from "../../services/uploader.service";
import {NotificationService} from "../../services/notification.service";
import {ComponentCanDeactivate} from "../../helpers/canDeactivate/componentCanDeactivate";
import {Observable, Subscription} from "rxjs";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, ComponentCanDeactivate, OnDestroy {
  subscriptions: Subscription = new Subscription();
  selectedFile: File;
  currentUser: User;
  profile: ProfileDto;
  save: boolean = false;
  photoUuidDel:string;
  loading: boolean;
  agentRoles: boolean;
  rgRoles: boolean;
  rgName: string = '';

  constructor(public util: Util,
              private uploader: UploaderService,
              private userService: UserService,
              private notifyService: NotificationService,
              private profileService: ProfileService,
              private authenticationService: AuthenticationService,
              private ngxLoader: NgxUiLoaderService) {
    this.subscriptions.add(this.authenticationService.currentUser.subscribe(x => this.currentUser = x));
    if (this.currentUser.roles != null) {
      this.agentRoles = false;
      this.rgRoles = false;
      console.log(this.currentUser.roles)
      for (const role of this.currentUser.roles) {
        if (role == 'AGENT_GROUP_CHOOSE') {
          this.agentRoles = true;
        }
        if (role == 'Руководитель группы') {
          this.rgRoles = true;
        }
      }

    }
    this.agentRoles = true;
  }

  ngOnInit(): void {
    this.profile = new ProfileDto();
    this.getProfile();
    this.findAgentByLogin();
    this.save = false;
    this.ngxLoader.stop();
  }

  getProfile() {
    this.subscriptions.add(this.profileService.getProfile().subscribe(res => {
      this.profile = res;
    }));
  }

  editProfile() {
    this.save = true;
  }

  saveProfile() {
    this.save = false;
    if(this.profile.photoUuid==null){
      if(!this.util.isNullOrEmpty(this.photoUuidDel)){
        this.removeByGuid(this.photoUuidDel);
      }
      }
    this.subscriptions.add(this.profileService.updateProfile(this.profile).subscribe(res => {
        this.profile = res;
        this.notifyService.showSuccess('Данные сохранены', "");
      }, err => {
        this.notifyService.showError('warning', err);

      }
    ));
  }


  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    this.loading = true;
    this.subscriptions.add(this.uploader.uploadData(this.selectedFile)
      .subscribe(data => {
        if (data && data.uuid) {
          this.profile.photoUuid = data.uuid;
        }
      }));
  }

  getSrcImg(photoUuid) {
    if (!this.util.isNullOrEmpty(photoUuid)) {
      return this.util.generatorPreviewUrl(this.profile.photoUuid)
    }
    return 'http://ssl.gstatic.com/accounts/ui/avatar_2x.png';
  }

  delImage(photoUuid){
    this.profile.photoUuid=null;
    this.photoUuidDel=photoUuid;
  }

  removeByGuid(photoUuid) {
    this.subscriptions.add(this.uploader.removePhotoById(photoUuid).subscribe(data => {
    }));
  }

  canDeactivate(): boolean | Observable<boolean> {
    if (this.save) {
      return confirm("Внесенные данные не сохранены, данные будут потеряны. Покинуть страницу?");
    } else {
      return true;
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  findAgentByLogin() {
    this.subscriptions.add(
      this.userService.findAgentByLogin(this.util.getCurrentUser().login).subscribe(res=>{
        this.rgName = res.group;
      })
    );
  }
}
