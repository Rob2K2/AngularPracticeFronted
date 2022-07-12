import { Selector } from '@ngxs/store';
import { ItemsStateModel, ItemState } from './items.state';

export class ItemsSelectors {
  @Selector([ItemState])
  static getItems(state: ItemsStateModel) {
    return state.items;
  }
}
