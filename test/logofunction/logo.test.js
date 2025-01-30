import { render, screen } from "@testing-library/react";
import {
  getLogo,
  getLogoImage,
  getHeaderLoge,
  getFaviconUrl,
} from "../../src/pages/twofactorauthentication/reusableFun";

jest.mock("../../src/utils/config", () => ({
  companyDeatils: "cogentai", 
}));

describe("ReusableFunction", () => {
  beforeEach(() => {
    jest.resetModules(); 
  });

  describe("getLogoImage", () => {
    it("renders the Cogentai logo when companyDeatils is 'cogentai'", () => {
      const { container } = render(getLogoImage());
      const logo = screen.getByAltText("Cogentai Logo");
      expect(logo).toBeInTheDocument();
      expect(container).toMatchSnapshot();
    });
  });

  describe("getHeaderLoge", () => {
    it("renders the Cogentai header logo when companyDeatils is 'cogentai'", () => {
      const { container } = render(getHeaderLoge());
      const headerLogo = screen.getByAltText("Cogentai Header Logo");
      expect(headerLogo).toBeInTheDocument();
      expect(container).toMatchSnapshot();
    });
  });

  describe("getFaviconUrl", () => {
    it("returns the correct favicon URL for 'cogentai'", () => {
      jest.mock("../../src/utils/config", () => ({
        companyDeatils: "cogentai",
      }));
      const favicon = getFaviconUrl();
      expect(favicon).toBe("/favicon.png");
    });

    it("returns the default favicon URL when companyDeatils is not matched", () => {
      jest.mock("../../src/utils/config", () => ({
        companyDeatils: "unknown",
      }));
      const favicon = getFaviconUrl();
      expect(favicon).toBe("/favicon.png");
    });
  });

  describe("getLogo", () => {
    it("renders the Cogentai chat logo when companyDeatils is 'cogentai'", () => {
      const { container } = render(getLogo());
      const logo = screen.getByAltText("Cogentai Chat Logo");
      expect(logo).toBeInTheDocument();
      expect(container).toMatchSnapshot();
    });

  });
});
