import { proxy } from "./proxy";
import { updateSession } from "./lib/supabase/middleware";

jest.mock("./lib/supabase/middleware", () => ({
  updateSession: jest.fn(),
}));

describe("Proxy (Middleware)", () => {
  let mockResponse: { cookies: { set: jest.Mock } };

  beforeEach(() => {
    jest.clearAllMocks();
    mockResponse = {
      cookies: {
        set: jest.fn(),
      },
    };
    (updateSession as jest.Mock).mockResolvedValue({
      supabaseResponse: mockResponse,
      user: null,
    });
  });

  it("should redirect to login if no user and accessing /app", async () => {
    const req = {
      url: "http://localhost:3000/app/dashboard",
      nextUrl: { pathname: "/app/dashboard" },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await proxy(req as any);
    expect(response.headers.get("location")).toContain("/login");
  });

  it("should redirect to login if no user and accessing /", async () => {
    const req = {
      url: "http://localhost:3000/",
      nextUrl: { pathname: "/" },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await proxy(req as any);
    expect(response.headers.get("location")).toContain("/login");
  });

  it("should redirect to /app if user exists and accessing /login", async () => {
    (updateSession as jest.Mock).mockResolvedValue({
      supabaseResponse: mockResponse,
      user: { id: "123" },
    });

    const req = {
      url: "http://localhost:3000/login",
      nextUrl: { pathname: "/login" },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await proxy(req as any);
    expect(response.headers.get("location")).toContain("/app");
  });

  it("should redirect to /app if user exists and accessing /", async () => {
    (updateSession as jest.Mock).mockResolvedValue({
      supabaseResponse: mockResponse,
      user: { id: "123" },
    });

    const req = {
      url: "http://localhost:3000/",
      nextUrl: { pathname: "/" },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await proxy(req as any);
    expect(response.headers.get("location")).toContain("/app");
  });
});
