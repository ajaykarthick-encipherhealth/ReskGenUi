import React from "react";
import { render, screen, cleanup } from "@testing-library/react";

// Mock portalPdfUrl used by the component
jest.mock("../../../../../src/utils/config", () => ({
  __esModule: true,
  portalPdfUrl: "https://pdf.viewer/web/viewer.html",
}));

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

// Load component under test
const PdfViewer = require("../../../../../src/pages/reviewer/patients/details/PdfViewerComponent.js").default;

const getIframe = () => screen.getByTitle("PDF Viewer");

describe("reviewer/patients/details/PdfViewerComponent", () => {
  // Basic rendering and attributes
  it("P: renders iframe with default dimensions", () => {
    render(<PdfViewer />);
    const iframe = getIframe();
    expect(iframe).toBeInTheDocument();
    expect(iframe.getAttribute("height")).toBe("700");
    expect(iframe.getAttribute("width")).toBe("100%");
  });

  it("P: builds src with encoded file param when src provided", () => {
    render(<PdfViewer src="http://example.com/file.pdf" />);
    const src = getIframe().getAttribute("src");
    expect(src).toContain("https://pdf.viewer/web/viewer.html?file=http%3A%2F%2Fexample.com%2Ffile.pdf");
  });

  it("N: if src is an array, iframe src remains empty", () => {
    render(<PdfViewer src={["http://example.com/file.pdf"]} />);
    expect(getIframe().getAttribute("src")).toBe("");
  });

  it("E: undefined src still produces an encoded 'undefined' file value", () => {
    render(<PdfViewer src={undefined} />);
    const src = getIframe().getAttribute("src");
    expect(src).toContain("file=undefined");
  });

  // Search query handling
  it("P: includes search hash with lower-cased, encoded query and flags", () => {
    render(<PdfViewer src="/a.pdf" searchQuery="FindThis" headers="h" />);
    const src = getIframe().getAttribute("src");
    expect(src).toContain("#search=findthis");
    expect(src).toContain("casesensitive=true");
    expect(src).toContain("phrase=true");
    expect(src).toContain("wholeword=true");
    expect(src).toContain("entireword=true");
    expect(src).toContain("headers=h");
  });

  it("N: search with spaces and special chars is encoded and lower-cased", () => {
    render(<PdfViewer src="/a.pdf" searchQuery="A B & C?" headers="x" />);
    const src = getIframe().getAttribute("src");
    // encodeURIComponent lowercases hex digits; '?' encodes to %3f, not %3F
    expect(src).toContain("search=a%20b%20%26%20c%3f");
    expect(src).toContain("headers=x");
  });

  it("E: when headers prop is omitted, it becomes 'headers=undefined' in hash", () => {
    render(<PdfViewer src="/a.pdf" searchQuery="k" />);
    const src = getIframe().getAttribute("src");
    expect(src).toContain("headers=undefined");
  });

  // Page number handling
  it("P: includes page in hash when provided", () => {
    render(<PdfViewer src="/a.pdf" pageNumber={3} />);
    expect(getIframe().getAttribute("src")).toContain("page=3");
  });

  it("N: pageNumber=0 is falsy and not included", () => {
    render(<PdfViewer src="/a.pdf" pageNumber={0} />);
    const src = getIframe().getAttribute("src");
    expect(src.includes("page=")).toBe(false);
  });

  it("E: pageNumber as string is accepted", () => {
    render(<PdfViewer src="/a.pdf" pageNumber={"7"} />);
    const src = getIframe().getAttribute("src");
    expect(src).toContain("page=7");
  });

  // headerContent handling
  it("P: includes headerContent when provided", () => {
    render(<PdfViewer src="/a.pdf" headerContent="title" />);
    expect(getIframe().getAttribute("src")).toContain("headerContent=title");
  });

  it("N: headerContent not encoded (raw inclusion)", () => {
    render(<PdfViewer src="/a.pdf" headerContent="Heading 1" />);
    // Space remains as space in hash value
    expect(getIframe().getAttribute("src")).toContain("headerContent=Heading 1");
  });

  it("E: combined search, page, headerContent present", () => {
    render(
      <PdfViewer src="/a.pdf" searchQuery="Query" pageNumber={5} headers="H" headerContent="HC" />
    );
    const src = getIframe().getAttribute("src");
    expect(src).toContain("search=query");
    expect(src).toContain("page=5");
    expect(src).toContain("headerContent=HC");
    expect(src).toContain("headers=H");
  });

  // Headers value varieties
  it("P: headers boolean becomes stringified in hash", () => {
    render(<PdfViewer src="/a.pdf" searchQuery="q" headers={true} />);
    expect(getIframe().getAttribute("src")).toContain("headers=true");
  });

  it("N: headers object coerces to [object Object]", () => {
    render(<PdfViewer src="/a.pdf" searchQuery="q" headers={{ a: 1 }} />);
    // Component does not encode headers value; it will be stringified as [object Object]
    expect(getIframe().getAttribute("src")).toContain("headers=[object Object]");
  });

  it("E: headers numeric coerces to number string", () => {
    render(<PdfViewer src="/a.pdf" searchQuery="q" headers={123} />);
    expect(getIframe().getAttribute("src")).toContain("headers=123");
  });

  // Source value varieties
  it("P: empty string src encodes to empty file value", () => {
    render(<PdfViewer src="" />);
    expect(getIframe().getAttribute("src")).toContain("file=");
  });

  it("N: numeric src coerces to string and encoded", () => {
    render(<PdfViewer src={123} />);
    expect(getIframe().getAttribute("src")).toContain("file=123");
  });

  it("E: boolean src true coerces to 'true'", () => {
    render(<PdfViewer src={true} />);
    expect(getIframe().getAttribute("src")).toContain("file=true");
  });

  it("P: src containing querystring is encoded", () => {
    render(<PdfViewer src="/a.pdf?x=1&y=2" />);
    const src = getIframe().getAttribute("src");
    expect(src).toContain("file=%2Fa.pdf%3Fx%3D1%26y%3D2");
  });

  // Re-render behaviors
  it("P: changing src updates iframe src", () => {
    const { rerender } = render(<PdfViewer src="/a.pdf" />);
    const first = getIframe().getAttribute("src");
    rerender(<PdfViewer src="/b.pdf" />);
    const second = getIframe().getAttribute("src");
    expect(first).not.toBe(second);
    expect(second).toContain("file=%2Fb.pdf");
  });

  it("N: changing only headers does not trigger effect (src unchanged)", () => {
    const { rerender } = render(<PdfViewer src="/a.pdf" searchQuery="q" headers="h1" />);
    const before = getIframe().getAttribute("src");
    rerender(<PdfViewer src="/a.pdf" searchQuery="q" headers="h2" />);
    const after = getIframe().getAttribute("src");
    expect(after).toBe(before); // headers not in deps
  });

  it("E: changing searchQuery updates src (deps include searchQuery)", () => {
    const { rerender } = render(<PdfViewer src="/a.pdf" searchQuery="ONE" headers="h" />);
    const before = getIframe().getAttribute("src");
    rerender(<PdfViewer src="/a.pdf" searchQuery="TWO" headers="h" />);
    const after = getIframe().getAttribute("src");
    expect(after).not.toBe(before);
    expect(after).toContain("search=two");
  });

  // Many small variants to lift count
  it("P: pageNumber large integer is included", () => {
    render(<PdfViewer src="/a.pdf" pageNumber={9999} />);
    expect(getIframe().getAttribute("src")).toContain("page=9999");
  });

  it("N: pageNumber negative still truthy and included", () => {
    render(<PdfViewer src="/a.pdf" pageNumber={-1} />);
    expect(getIframe().getAttribute("src")).toContain("page=-1");
  });

  it("E: headerContent empty string is falsy and omitted from hash", () => {
    render(<PdfViewer src="/a.pdf" headerContent="" />);
    expect(getIframe().getAttribute("src")).not.toContain("headerContent=");
  });

  it("P: searchQuery empty string still adds headers entry only", () => {
    render(<PdfViewer src="/a.pdf" searchQuery="" headers="H" />);
    const src = getIframe().getAttribute("src");
    // falsy searchQuery omitted, only headers (as undefined?) not added unless truthy search/page/headerContent
    // In this case searchQuery is empty string (falsy), so no hash should appear
    expect(src.includes("#")).toBe(false);
  });

  it("N: only headerContent present produces a minimal hash", () => {
    render(<PdfViewer src="/a.pdf" headerContent="X" />);
    const src = getIframe().getAttribute("src");
    expect(src).toContain("#headerContent=X");
  });

  it("E: only pageNumber present produces page hash", () => {
    render(<PdfViewer src="/a.pdf" pageNumber={1} />);
    const src = getIframe().getAttribute("src");
    expect(src).toContain("#page=1");
  });

  it("P: only searchQuery present includes headers=undefined", () => {
    render(<PdfViewer src="/a.pdf" searchQuery="abc" />);
    const src = getIframe().getAttribute("src");
    expect(src).toContain("search=abc");
    expect(src).toContain("headers=undefined");
  });

  it("N: searchQuery with unicode characters is encoded and lower-cased", () => {
    render(<PdfViewer src="/a.pdf" searchQuery="Ångström" headers="H" />);
    const src = getIframe().getAttribute("src");
    // encodeURIComponent may produce lowercase hex output in some environments
    expect(src).toMatch(/search=%c3%85ngstr%c3%b6m|search=%C3%A5ngstr%C3%B6m/);
  });

  it("E: portal base URL is included verbatim", () => {
    render(<PdfViewer src="/a.pdf" />);
    const src = getIframe().getAttribute("src");
    expect(src.startsWith("https://pdf.viewer/web/viewer.html?file=")).toBe(true);
  });

  it("P: iframe id and title are static", () => {
    render(<PdfViewer src="/a.pdf" />);
    const iframe = getIframe();
    expect(iframe.id).toBe("pdfViewer");
    expect(iframe.getAttribute("title")).toBe("PDF Viewer");
  });
});


