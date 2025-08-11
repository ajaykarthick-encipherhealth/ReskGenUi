// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
// jest.setup.js
jest.mock("@azure/msal-browser", () => {
  return {
    PublicClientApplication: jest.fn().mockImplementation(() => ({
      initialize: jest.fn(() => Promise.resolve()),
      handleRedirectPromise: jest.fn(() => Promise.resolve()),
    })),
  };
});

// Mock redux-actions to avoid ES module import.meta issues
jest.mock("redux-actions", () => ({
  createAction: jest.fn((type) => {
    const actionCreator = jest.fn((payload) => ({ type, payload }));
    actionCreator.toString = () => type;
    return actionCreator;
  }),
  handleActions: jest.fn((handlers, initialState) => {
    return (state = initialState, action) => {
      if (handlers[action.type]) {
        return handlers[action.type](state, action);
      }
      return state;
    };
  }),
  createActionThunk: jest.fn((type, networkFunction) => {
    const thunk = jest.fn((...args) => async (dispatch) => {
      if (networkFunction) {
        const result = await networkFunction(...args);
        return result;
      }
    });
    thunk.START = `${type}_START`;
    thunk.STARTED = `${type}_STARTED`;
    thunk.SUCCEEDED = `${type}_SUCCEEDED`;
    thunk.FAILED = `${type}_FAILED`;
    thunk.ENDED = `${type}_ENDED`;
    thunk.NAME = type;
    return thunk;
  })
}));
