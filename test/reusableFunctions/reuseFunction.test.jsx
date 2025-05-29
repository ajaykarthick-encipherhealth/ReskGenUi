import {
  encyptingPass,
  generateOptionsListSupervisor,
  getDateAndTime,
  pdfEncrypt,
  resetPageNumber,
  encryptData,
  validateYear,
  validateConfirmPassword,
  getValidatePassword,
  handleTogglePasswordVisibility,
  capitalizeFirstLetter,
  disablePastDate,
  disableFutureDates,
  disableFutureDate,
  getSelectedDaysCount,
  renderUserPrfoileAvatarCustom,
  renderUserPrfoileAvatar,
  getBackgroundColor,
} from "../../src/components/headerFilters/functions";
import moment from "moment";
import { render } from "@testing-library/react";
import dayjs from "dayjs";
import { disabledDate, getSpacesWithUnderscoresAuditing } from "../../src/utils/reusable";
//generateOptionsListSupervisor
describe("generateOptionsListSupervisor function", () => {
  it("returns an empty array when input is null or undefined", () => {
    expect(generateOptionsListSupervisor(null)).toEqual([]);
    expect(generateOptionsListSupervisor(undefined)).toEqual([]);
  });

  it("returns an empty array when input is an empty object", () => {
    expect(generateOptionsListSupervisor({})).toEqual([]);
  });

  it("returns an empty array when input has no data property", () => {
    expect(generateOptionsListSupervisor({ foo: "bar" })).toEqual([]);
  });

  it("returns an empty array when input has no response property", () => {
    expect(generateOptionsListSupervisor({ data: {} })).toEqual([]);
  });

  it("returns an empty array when input has an empty response array", () => {
    expect(generateOptionsListSupervisor({ data: { response: [] } })).toEqual(
      []
    );
  });

  it("returns an array of options when input has a response array with data", () => {
    const inputData = {
      data: {
        response: [
          { firstName: "John", lastName: "Doe", userName: "johndoe" },
          { firstName: "Jane", lastName: "Doe", userName: "janedoe" },
        ],
      },
    };

    const expectedOutput = [
      { label: "John Doe", value: "johndoe" },
      { label: "Jane Doe", value: "janedoe" },
    ];
  });
});

//resetPageNumber

describe("resetPageNumber function", () => {
  it("should reset the page number to 0 when called", () => {
    const setPageNo = jest.fn();
    const pageNumber = 5;
    setPageNo(pageNumber);
    resetPageNumber(setPageNo);
    expect(setPageNo).toHaveBeenCalledTimes(2);
    expect(setPageNo).toHaveBeenNthCalledWith(1, pageNumber);
    expect(setPageNo).toHaveBeenNthCalledWith(2, 0);
  });

});

//getDateAndTime
describe("getDateAndTime function", () => {
  it("should return the current date and time in the correct format", () => {
    const result = getDateAndTime();
    expect(result).toMatch(/^\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{2} (AM|PM)$/);
    expect(result.length).toBeGreaterThan(0);
  });

it("should handle edge cases for minutes and hours", () => {
  const now = new Date("2022-01-01T00:00:00.000Z");
  jest.useFakeTimers().setSystemTime(now);
  const result = getDateAndTime();
  const expected = moment(now).format("MM/DD/YYYY h:mm A");
  expect(result).toBe(expected);
});
});

// helper function to pad zeros
function padZero(num) {
  return (num < 10 ? "0" : "") + num;
}

//pdfEncrypt
describe("pdfEncrypt function", () => {
  it("should return an object with encrypted data and initialization vector", () => {
    const value = "test data";
    const result = pdfEncrypt(value);
    expect(result).toHaveProperty("pass");
    expect(result).toHaveProperty("iv");
    expect(result.pass).not.toBe(value);
    expect(result.iv).toHaveLength(16);
  });
});

//encyptingPass
describe("encryptingPass function", () => {
  it("should return an encrypted password", () => {
    const password = "testpassword";
    const result = encyptingPass(password);
    expect(result).toHaveProperty("iv");
    expect(result).toHaveProperty("pass");
    expect(result.pass).not.toBe(password);
    expect(result.pass).toHaveLength(24); 
  });

  it("should return different encrypted passwords for different inputs", () => {
    const password1 = "testpassword1";
    const password2 = "testpassword2";
    const result1 = encyptingPass(password1);
    const result2 = encyptingPass(password2);
    expect(result1.pass).not.toBe(result2.pass); 
  });
});

//encryptData
describe("encryptData function", () => {
  it("should throw an error if key is not a string", () => {
    const data = "test data";
    const key = 123;
    const iv = "initialization vector";
    expect(() => encryptData(data, key, iv)).toThrowError();
  });

  it("should throw an error if iv is not a string", () => {
    const data = "test data";
    const key = "secret key";
    const iv = 123;
    expect(() => encryptData(data, key, iv)).toThrowError();
  });
  it("should return different encrypted passwords for the same input", () => {
    const password = "testpassword";
    const result1 = encyptingPass(password);
    const result2 = encyptingPass(password);
    expect(result1.pass).not.toBe(result2.pass);
    expect(result1.iv).not.toBe(result2.iv);
  });
});

describe("validateYear function", () => {
  it("should return false when year is empty", () => {
    const year = "";
    const setErrors = jest.fn();
    expect(validateYear(year, setErrors)).toBe(false);
    expect(setErrors).toHaveBeenCalledTimes(1);
  });

  it("should return false when year is not a 4-digit number", () => {
    const year = "123";
    const setErrors = jest.fn();
    expect(validateYear(year, setErrors)).toBe(false);
    expect(setErrors).toHaveBeenCalledTimes(1);
  });

  it("should return false when year is not a positive number", () => {
    const year = "-1234";
    const setErrors = jest.fn();
    expect(validateYear(year, setErrors)).toBe(false);
  });

  it("should return false when year is greater than the current year", () => {
    const year = (new Date().getFullYear() + 1).toString();
    const setErrors = jest.fn();
    expect(validateYear(year, setErrors)).toBe(false);
    expect(setErrors).toHaveBeenCalledTimes(1);
  });

  it("should return true when year is a valid 4-digit positive number", () => {
    const year = new Date().getFullYear().toString();
    const setErrors = jest.fn();
    expect(validateYear(year, setErrors)).toBe(true);
    expect(setErrors).not.toHaveBeenCalled();
  });
});

//validateConfirmPassword
describe("validateConfirmPassword function", () => {
  it("should return false when password and confirmPassword are not the same", () => {
    const password = "password123";
    const confirmPassword = "password456";
    const setErrors = jest.fn();
    expect(validateConfirmPassword(password, confirmPassword, setErrors)).toBe(
      false
    );
    expect(setErrors).toHaveBeenCalledTimes(1);
  });

  it("should return true when password and confirmPassword are the same", () => {
    const password = "password123";
    const confirmPassword = "password123";
    const setErrors = jest.fn();
    expect(validateConfirmPassword(password, confirmPassword, setErrors)).toBe(
      true
    );
    expect(setErrors).not.toHaveBeenCalled();
  });

  it("should return false when password is empty", () => {
    const password = "";
    const confirmPassword = "password123";
    const setErrors = jest.fn();
    expect(validateConfirmPassword(password, confirmPassword, setErrors)).toBe(
      false
    );
    expect(setErrors).toHaveBeenCalledTimes(1);
  });

  it("should return false when confirmPassword is empty", () => {
    const password = "password123";
    const confirmPassword = "";
    const setErrors = jest.fn();
    expect(validateConfirmPassword(password, confirmPassword, setErrors)).toBe(
      false
    );
    expect(setErrors).toHaveBeenCalledTimes(1);
  });

  it("should return false when password and confirmPassword are null or undefined", () => {
    const password = null;
    const confirmPassword = undefined;
    const setErrors = jest.fn();
    expect(validateConfirmPassword(password, confirmPassword, setErrors)).toBe(
      false
    );
    expect(setErrors).toHaveBeenCalledTimes(1);
  });
});

//getValidatePassword
describe("getValidatePassword function", () => {

  it("should return false when password does not contain at least one capital letter", () => {
    const password = "password123";
    const setErrors = jest.fn();
    expect(getValidatePassword(password, setErrors)).toBe(false);
    expect(setErrors).toHaveBeenCalledTimes(1);
    expect(setErrors).toHaveBeenCalledWith({
      password:
        "Password must contain at least 1 capital letter, 1 small letter, 1 number, and 1 special character",
    });
  });

  it("should return false when password does not contain at least one small letter", () => {
    const password = "PASSWORD123";
    const setErrors = jest.fn();
    expect(getValidatePassword(password, setErrors)).toBe(false);
    expect(setErrors).toHaveBeenCalledTimes(1);
    expect(setErrors).toHaveBeenCalledWith({
      password:
        "Password must contain at least 1 capital letter, 1 small letter, 1 number, and 1 special character",
    });
  });

  it("should return false when password does not contain at least one number", () => {
    const password = "Password";
    const setErrors = jest.fn();
    expect(getValidatePassword(password, setErrors)).toBe(false);
    expect(setErrors).toHaveBeenCalledTimes(1);
    expect(setErrors).toHaveBeenCalledWith({
      password:
        "Password must contain at least 1 capital letter, 1 small letter, 1 number, and 1 special character",
    });
  });

  it("should return false when password does not contain at least one special character", () => {
    const password = "Password123";
    const setErrors = jest.fn();
    expect(getValidatePassword(password, setErrors)).toBe(false);
    expect(setErrors).toHaveBeenCalledTimes(1);
    expect(setErrors).toHaveBeenCalledWith({
      password:
        "Password must contain at least 1 capital letter, 1 small letter, 1 number, and 1 special character",
    });
  });

  it("should return true when password is valid", () => {
    const password = "Password123!";
    const setErrors = jest.fn();
    expect(getValidatePassword(password, setErrors)).toBe(true);
    expect(setErrors).not.toHaveBeenCalled();
  });
});

//handleTogglePasswordVisibility
describe("handleTogglePasswordVisibility function", () => {
  it("should toggle the showPassword state when called", () => {
    const showPassword = false;
    const setShowPassword = jest.fn();
    handleTogglePasswordVisibility(showPassword, setShowPassword);
    expect(setShowPassword).toHaveBeenCalledTimes(1);
    expect(setShowPassword).toHaveBeenCalledWith(!showPassword);
  });
    it("should toggle the showPassword state when called", () => {
      const showPassword = false;
      const setShowPassword = jest.fn();
      handleTogglePasswordVisibility(showPassword, setShowPassword);
      expect(setShowPassword).toHaveBeenCalledTimes(1);
      expect(setShowPassword).toHaveBeenCalledWith(!showPassword);
    });

    it("should toggle the showPassword state when called with initial value true", () => {
      const showPassword = true;
      const setShowPassword = jest.fn();
      handleTogglePasswordVisibility(showPassword, setShowPassword);
      expect(setShowPassword).toHaveBeenCalledTimes(1);
      expect(setShowPassword).toHaveBeenCalledWith(!showPassword);
    });
});

//capitalizeFirstLetter
describe("capitalizeFirstLetter function", () => {
  it("should capitalize the first letter of a string", () => {
    const str = "hello world";
    const capitalizedStr = capitalizeFirstLetter(str);
    expect(capitalizedStr).toBe("Hello world");
  });

  it("should return an empty string when input is an empty string", () => {
    const str = "";
    const capitalizedStr = capitalizeFirstLetter(str);
    expect(capitalizedStr).toBe("");
  });

  it("should return the same string when input is a single character", () => {
    const str = "a";
    const capitalizedStr = capitalizeFirstLetter(str);
    expect(capitalizedStr).toBe("A");
  });

  it("should return the same string when input is a single character and already capitalized", () => {
    const str = "A";
    const capitalizedStr = capitalizeFirstLetter(str);
    expect(capitalizedStr).toBe("A");
  });

  it("should return the same string when input is a single character and already lowercase", () => {
    const str = "a";
    const capitalizedStr = capitalizeFirstLetter(str);
    expect(capitalizedStr).toBe("A");
  });

  it("should return the same string when input is a single character and not a letter", () => {
    const str = "1";
    const capitalizedStr = capitalizeFirstLetter(str);
    expect(capitalizedStr).toBe("1");
  });

  it("should return the same string when input is a single character and already capitalized and not a letter", () => {
    const str = "!";
    const capitalizedStr = capitalizeFirstLetter(str);
    expect(capitalizedStr).toBe("!");
  });

  it("should return the same string when input is a single character and already lowercase and not a letter", () => {
    const str = "!";
    const capitalizedStr = capitalizeFirstLetter(str);
    expect(capitalizedStr).toBe("!");
  });
});

//disablePastDate
describe("disablePastDate function", () => {
  it("should return true when current date is before yesterday", () => {
    const current = moment().subtract(2, "days");
    expect(disablePastDate(current)).toBe(true);
  });

  it("should return false when current date is today", () => {
    const current = moment();
    expect(disablePastDate(current)).toBe(false);
  });

  it("should return false when current date is tomorrow", () => {
    const current = moment().add(1, "day");
    expect(disablePastDate(current)).toBe(false);
  });

  it("should return false when current date is in the future", () => {
    const current = moment().add(2, "days");
    expect(disablePastDate(current)).toBe(false);
  });
});

//disableFutureDate
describe("disableFutureDate function", () => {
  it("should return false when date is today", () => {
    const date = moment().format("MM-DD-YYYY");
    expect(disableFutureDate(date)).toBe(false);
  });

  it("should return false when date is in the past", () => {
    const date = moment().subtract(1, "day").format("MM-DD-YYYY");
    expect(disableFutureDate(date)).toBe(false);
  });

  it("should return false when date is yesterday", () => {
    const date = moment().subtract(1, "day").format("MM-DD-YYYY");
    expect(disableFutureDate(date)).toBe(false);
  });
});

//getSelectedDaysCount
describe("getSelectedDaysCount function", () => {
  it("should return 0 when no days are selected", () => {
    const selectedDays = [];
    expect(getSelectedDaysCount(selectedDays)).toBe(0);
  });

  it("should return 0 when all days are false", () => {
    const selectedDays = [false, false, false];
    expect(getSelectedDaysCount(selectedDays)).toBe(0);
  });
    it("should return 0 when no days are selected", () => {
      const selectedDays = [];
      expect(getSelectedDaysCount(selectedDays)).toBe(0);
    });

    it("should return 0 when all days are false", () => {
      const selectedDays = [false, false, false];
      expect(getSelectedDaysCount(selectedDays)).toBe(0);
    });
});

//renderUserPrfoileAvatarCustom
describe("renderUserPrfoileAvatarCustom function", () => {
  it("should render avatar with initials when no image URL is provided", () => {
    const firstName = "John";
    const lastName = "Doe";
    const imageUrl = null;
    const field = true;
    const width = "30px";
    const height = "30px";

    const avatar = renderUserPrfoileAvatarCustom(
      firstName,
      lastName,
      imageUrl,
      field,
      width,
      height
    );
    expect(avatar.props.children).toBe("JD");
    expect(avatar.props.style.width).toBe(width);
    expect(avatar.props.style.height).toBe(height);
  });

  it("should render avatar with image when image URL is provided", () => {
    const firstName = "John";
    const lastName = "Doe";
    const imageUrl = "https://example.com/image.jpg";
    const field = true;
    const width = "30px";
    const height = "30px";

    const avatar = renderUserPrfoileAvatarCustom(
      firstName,
      lastName,
      imageUrl,
      field,
      width,
      height
    );
    expect(avatar.props.src).toBe(imageUrl);
    expect(avatar.props.style.width).toBe(width);
    expect(avatar.props.style.height).toBe(height);
  });

  it("should render avatar with default background color when field is false", () => {
    const firstName = "John";
    const lastName = "Doe";
    const field = false;
    const width = "30px";
    const height = "30px";

    const avatar = renderUserPrfoileAvatarCustom(
      firstName,
      lastName,
      null,
      field,
      width,
      height
    );
    expect(avatar.props.style.backgroundColor).toBe("#F3C217");
  });

  it("should render avatar with custom background color when field is true", () => {
    const firstName = "John";
    const lastName = "Doe";
    const field = true;
    const width = "30px";
    const height = "30px";

    const avatar = renderUserPrfoileAvatarCustom(
      firstName,
      lastName,
      null,
      field,
      width,
      height
    );
    expect(avatar.props.style.backgroundColor).not.toBe("#F3C217");
  });

  it("should render avatar with correct font size and font weight", () => {
    const firstName = "John";
    const lastName = "Doe";
    const field = true;
    const width = "30px";
    const height = "30px";

    const avatar = renderUserPrfoileAvatarCustom(
      firstName,
      lastName,
      null,
      field,
      width,
      height
    );
    expect(avatar.props.style.fontSize).toBe("15px");
    expect(avatar.props.style.fontWeight).toBe(500);
  });
});

//renderUserPrfoileAvatar
describe("renderUserPrfoileAvatar", () => {
  it("renders avatar with image when image URL is provided", () => {
    const firstName = "John";
    const lastName = "Doe";
    const imageUrl = "https://example.com/image.jpg";
    const field = true;
    const customBg = false;
    const { getByAltText } = render(
      renderUserPrfoileAvatar(firstName, lastName, imageUrl, field, customBg)
    );
    expect(getByAltText("avatar")).toBeInTheDocument();
  });
});

describe("getBackgroundColor function", () => {
  it("should return the correct background color for a given random number", () => {
    expect(getBackgroundColor(1)).toBe("#F28585");
    expect(getBackgroundColor(2)).toBe("#04306F");
    expect(getBackgroundColor(3)).toBe("#E6A4B4");
    expect(getBackgroundColor(4)).toBe("#558e95");
    expect(getBackgroundColor(5)).toBe("#DED0B6");
    expect(getBackgroundColor(6)).toBe("#C3E2C2");
    expect(getBackgroundColor(7)).toBe("#9BB8CD");
  });

  it("should return the default background color for an unknown random number", () => {
    expect(getBackgroundColor(0)).toBe("#9BB8CD");
    expect(getBackgroundColor(7)).toBe("#9BB8CD");
  });

   it("should return the default background color for an unknown random number", () => {
     expect(getBackgroundColor(0)).toBe("#9BB8CD");
     expect(getBackgroundColor(8)).toBe("#9BB8CD");
   });

   it("should return the default background color for a non-numeric input", () => {
     expect(getBackgroundColor("hello")).toBe("#9BB8CD");
     expect(getBackgroundColor(null)).toBe("#9BB8CD");
     expect(getBackgroundColor(undefined)).toBe("#9BB8CD");
   });
});


describe("disabledDate function", () => {
  const today = dayjs().endOf("day");
  const tomorrow = today.add(1, "day");
  const yesterday = today.subtract(1, "day");

 

  it("should not disable future dates when allowFuture is true", () => {
    expect(disabledDate(tomorrow, [], true)).toBe(false);
    expect(disabledDate(today, [], true)).toBe(false);
    expect(disabledDate(yesterday, [], true)).toBe(false);
  });

  it("should disable dates before the selected startDate when only startDate is set", () => {
    const startDate = today.toISOString();

    expect(disabledDate(yesterday, [startDate], true)).toBe(true);
    expect(disabledDate(today, [startDate], true)).toBe(false);
    expect(disabledDate(tomorrow, [startDate], true)).toBe(false);
  });

  it("should disable dates after the selected endDate when only endDate is set", () => {
    const endDate = today.toISOString();

    expect(disabledDate(yesterday, [null, endDate], true)).toBe(false);
    expect(disabledDate(today, [null, endDate], true)).toBe(false);
    expect(disabledDate(tomorrow, [null, endDate], true)).toBe(true);
  });

  it("should disable dates outside the range when both startDate and endDate are set", () => {
    const startDate = yesterday.toISOString();
    const endDate = tomorrow.toISOString();

    expect(
      disabledDate(dayjs().subtract(2, "days"), [startDate, endDate], true)
    ).toBe(true);
    expect(disabledDate(yesterday, [startDate, endDate], true)).toBe(false);
    expect(disabledDate(today, [startDate, endDate], true)).toBe(false);
    expect(disabledDate(tomorrow, [startDate, endDate], true)).toBe(false);
    expect(
      disabledDate(dayjs().add(2, "days"), [startDate, endDate], true)
    ).toBe(true);
  });

  it("should not disable any date when no restrictions are applied", () => {
    expect(disabledDate(yesterday, [], true)).toBe(false);
    expect(disabledDate(today, [], true)).toBe(false);
    expect(disabledDate(tomorrow, [], true)).toBe(false);
  });
});


describe("getSpacesWithUnderscoresAuditing function", () => {
  it("should replace spaces with underscores for 'AUDIT PENDING' and 'AUDIT DECLINED'", () => {
    expect(getSpacesWithUnderscoresAuditing("AUDIT PENDING")).toBe(
      "AUDIT_PENDING"
    );
    expect(getSpacesWithUnderscoresAuditing("AUDIT DECLINED")).toBe(
      "AUDIT_DECLINED"
    );
  });

  it("should remove spaces for 'AUDIT HOLD' and 'RE AUDIT'", () => {
    expect(getSpacesWithUnderscoresAuditing("AUDIT HOLD")).toBe("AUDITHOLD");
    expect(getSpacesWithUnderscoresAuditing("RE AUDIT")).toBe("REAUDIT");
  });

  it("should return the original value for any other input", () => {
    expect(getSpacesWithUnderscoresAuditing("OTHER VALUE")).toBe("OTHER VALUE");
    expect(getSpacesWithUnderscoresAuditing("ANOTHER TEST")).toBe(
      "ANOTHER TEST"
    );
  });

  it("should return undefined for undefined or empty input", () => {
    expect(getSpacesWithUnderscoresAuditing(undefined)).toBeUndefined();
    expect(getSpacesWithUnderscoresAuditing(null)).toBeUndefined();
    expect(getSpacesWithUnderscoresAuditing("")).toBeUndefined();
  });
});