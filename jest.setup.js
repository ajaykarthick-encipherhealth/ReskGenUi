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
