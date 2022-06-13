import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../models/user';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private _user!: User;
  userSubscription!: Subscription;

  get user() {
    return this._user;
  }

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.userSubscription = this.store
      .select('user')
      .subscribe((loggedUser) => {
        this._user = loggedUser.user!;
      });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
