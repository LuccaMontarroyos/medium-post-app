import { describe, it, expect } from "vitest";
import SchemaValidator from "../../src/middlewares/schemaValidator.js";

describe("SchemaValidator", () => {
  it("maps known validation error types to messages", () => {
    const message = SchemaValidator.getMessage({
      type: "required",
      path: "email",
    });

    expect(message).toContain("email");
  });

  it("falls back to error message when type is unknown", () => {
    const message = SchemaValidator.getMessage({
      type: "custom_unknown",
      message: "Campo inválido",
    });

    expect(message).toBe("Campo inválido");
  });
});
