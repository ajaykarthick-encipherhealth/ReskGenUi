import { notification } from "antd";
import axios from "axios";

export const ENABLEMFA = "ENABLEMFA";

export const getMFAValidation = (username, route, password) => {
    return () => {
      mfaValidation(username, route, password).then((response) => {
        const skip = response?.data?.response?.skipEntryAvailable;
        const mfa = response?.data?.response?.mfaIsEnabled;
        if (response?.data?.response) {
          const encodedParams = btoa(
            JSON.stringify({
              mfa: mfa,
              skipEntry: skip,
              username: username,
              password: password,
            })
          );
          route?.push({
            pathname: `/twofactorAuthentication/Authentication`,
            search: `params=${encodedParams}`,
          });
        } else {
          notification.error({
            message: response?.data?.message,
            duration: 1,
          });
        }
      });
    };
  };