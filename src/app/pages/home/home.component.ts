import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../models/user';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription, Observable } from 'rxjs';
import { addItems } from './items.actions';
import { selectItems } from './items.selectors';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  userItems$!: Observable<string[]>;
  private _user!: User;
  userSubscription!: Subscription;

  get user() {
    return this._user;
  }

  itemsArray: string[] = ['a', 'b'];

  constructor(private store: Store<AppState>) {
    this.userItems$ = this.store.select(selectItems);
  }

  ngOnInit(): void {
    this.userSubscription = this.store
      .select('user')
      .subscribe((loggedUser) => {
        this._user = loggedUser.user!;
      });

    this.store.dispatch(addItems({ items: this.itemsArray }));
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
