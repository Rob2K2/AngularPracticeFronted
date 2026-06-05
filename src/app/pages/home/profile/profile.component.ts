import { Component, Input } from '@angular/core';
import { User } from '../../../models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  @Input() userProfile!: User;

  get avatarUrl(): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      this.userProfile.username
    )}&background=0D6EFD&color=fff`;
  }
}
