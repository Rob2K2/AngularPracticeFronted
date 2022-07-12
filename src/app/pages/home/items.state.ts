import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { AddItemsAction } from './items.actions';

export interface ItemsStateModel {
  items: string[];
}

@State<ItemsStateModel>({
  name: 'items',
  defaults: {
    items: [],
  },
})

@Injectable()
export class ItemState {
  @Action(AddItemsAction)
  addItems(ctx: StateContext<ItemsStateModel>, action: AddItemsAction) {
    const { items } = action;
    const state = ctx.getState();
    ctx.setState({
      items: items,
    });

    console.log(ctx.getState());
  }
}
