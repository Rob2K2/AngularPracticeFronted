import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromItems from './items.reducer';

export const selectItemsState = createFeatureSelector<fromItems.State>('items');

export const selectItems = createSelector(
  selectItemsState,
  (state) => state.items
);
