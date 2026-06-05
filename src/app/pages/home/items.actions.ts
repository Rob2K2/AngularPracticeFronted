import { createAction, props } from '@ngrx/store';

export const addItems = createAction(
  '[Items] Add Items',
  props<{ items: string[] }>()
);
