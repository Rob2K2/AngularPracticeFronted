import { authReducer, initialState } from './auth.reducer';
import { setUser, unSetUser } from './auth.actions';
import { User } from '../../models/user';

const mockUser = new User(
  'demo',
  'demo@local.dev',
  '2020-01-01T00:00:00.000Z'
);

describe('authReducer', () => {
  it('should return the initial state', () => {
    const state = authReducer(undefined, { type: 'unknown' } as never);

    expect(state).toEqual(initialState);
  });

  it('should store the user on setUser', () => {
    const state = authReducer(initialState, setUser({ user: mockUser }));

    expect(state.user).toEqual(
      jasmine.objectContaining({
        username: mockUser.username,
        email: mockUser.email,
        registerDate: mockUser.registerDate,
      })
    );
  });

  it('should clear the user on unSetUser', () => {
    const withUser = authReducer(initialState, setUser({ user: mockUser }));
    const state = authReducer(withUser, unSetUser());

    expect(state.user).toBeNull();
  });
});
