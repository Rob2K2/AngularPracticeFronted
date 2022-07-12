import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../models/user';
import { Store } from '@ngrx/store';
import * as ngxs from '@ngxs/store';
import { AppState } from '../../app.reducer';
import { Subscription, Observable } from 'rxjs';
import { AddItemsAction } from './items.actions';
import { Select } from '@ngxs/store';
import { ItemsSelectors } from './items.selectors';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  @Select(ItemsSelectors.getItems) userItems$!: Observable<string[]>;
  private _user!: User;
  userSubscription!: Subscription;

  get user() {
    return this._user;
  }

  itemsArray: string[] = ['a', 'b'];

  constructor(private store: Store<AppState>, private ngxsStore: ngxs.Store) {}

  ngOnInit(): void {
    this.userSubscription = this.store
      .select('user')
      .subscribe((loggedUser) => {
        this._user = loggedUser.user!;
      });

    this.ngxsStore.dispatch(new AddItemsAction(this.itemsArray));
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
