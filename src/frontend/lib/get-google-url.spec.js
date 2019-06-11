import getGoogleUrl from "./get-google-url";

describe("get-google-url", () => {
  it("throws an error on no argument", () => {
    expect(() => getGoogleUrl()).toThrow();
  });

  it("throws an error when there is an empty string as argument", () => {
    expect(() => getGoogleUrl("")).toThrow();
  });

  it("returns the proper URL", () => {
    expect(getGoogleUrl("This is a test of the basic functionality")).toMatchSnapshot();
  });

  it("returns the proper URL when Umlaute are used", () => {
    expect(getGoogleUrl("Das ist ein Sätzchen mit Umlauten dass das mal getestet wird")).toMatchSnapshot();
  });
});
