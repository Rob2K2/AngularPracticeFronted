import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../auth/interfaces/interfaces';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  @Input() userProfile!: User;

  constructor() {}

  ngOnInit(): void {}
}
