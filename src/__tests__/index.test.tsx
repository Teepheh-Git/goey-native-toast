import { Toaster, useToastStore, toast } from "../index";

describe("Library Exports", () => {
  it("should export core components and utilities", () => {
    expect(Toaster).toBeDefined();
    expect(useToastStore).toBeDefined();
    expect(toast).toBeDefined();
  });
});
