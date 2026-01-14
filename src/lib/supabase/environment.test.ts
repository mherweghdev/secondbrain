describe("Supabase Environment Configuration", () => {
  it("should have Supabase URL configured", () => {
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).not.toBe("");
  });

  it("should have Supabase Publishable Key configured", () => {
    expect(
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    ).toBeDefined();
    expect(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY).not.toBe(
      "",
    );
  });
});
