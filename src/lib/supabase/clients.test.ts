import { createClient as createBrowserClient } from "./client";
import { createClient as createServerClient } from "./server";

// Mocking cookies for server client test
jest.mock("next/headers", () => ({
  cookies: jest.fn(async () => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  })),
}));

describe("Supabase Clients", () => {
  describe("Browser Client", () => {
    it("should create a browser client", () => {
      const client = createBrowserClient();
      expect(client).toBeDefined();
    });
  });

  describe("Server Client", () => {
    it("should create a server client", async () => {
      const client = await createServerClient();
      expect(client).toBeDefined();
    });
  });
});
