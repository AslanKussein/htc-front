import {Component, OnInit} from '@angular/core';
import {Util} from "../services/util";
import {ClientsService} from "../services/clients.service";
import {User} from "../models/users";
import {AuthenticationService} from "../services/authentication.service";
import {ProfileService} from "../services/profile.service";
import {ProfileDto} from "../models/profile/profileDto";
import {UploaderService} from "../services/uploader.service";
import {NotificationService} from "../services/notification.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  selectedFile: File;

  currentUser: User;
  profiles: ProfileDto;
  save: boolean;
  loading: boolean;


  constructor(private util: Util,
              private uploader: UploaderService,
              private notifyService: NotificationService,
              private profileService: ProfileService,
              private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  profile = {
    phone: '',
    email: '',
    address: '',
    transport: '',
    photoUuid: null
  }

  dnHref(href) {
    this.util.dnHref(href);
  }

  ngOnInit(): void {

    this.getProfile();
    this.save = false;
  }


  getProfile() {
    this.profileService.getProfile().subscribe(res => {
      this.profile = res;
    });
  }

  editProfile() {
    this.save = true;
  }

  saveProfile() {
    this.save = false;
    this.profileService.updateProfile(this.profile).subscribe(res => {
        this.profile = res;
        this.notifyService.showSuccess('Данные сохранены', "");

      }, err => {
        this.notifyService.showError('warning', err);

      }
    );
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    this.loading = true;
    this.uploader.uploadData(this.selectedFile)
      .subscribe(data => {
        if (data != null) {
          this.profile.photoUuid = data.uuid;
        }
      });
  }

  getSrcImg(photoUuid) {
    if (!this.util.isNullOrEmpty(photoUuid)) {
      return this.util.generatorPreviewUrl(this.profile.photoUuid)
    }
    ;
    return 'http://ssl.gstatic.com/accounts/ui/avatar_2x.png';
  }

}
