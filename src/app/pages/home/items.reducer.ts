import { createReducer, on } from '@ngrx/store';
import { addItems } from './items.actions';

export interface State {
  items: string[];
}

export const initialState: State = {
  items: [],
};

export const itemsReducer = createReducer(
  initialState,
  on(addItems, (state, { items }) => ({ ...state, items: [...items] }))
);
