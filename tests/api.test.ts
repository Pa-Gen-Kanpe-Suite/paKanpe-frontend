import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, api, roleHome } from "@/lib/api";

afterEach(() => vi.restoreAllMocks());

describe("API client", () => {
  it("returns JSON on success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } })));
    await expect(api<{ ok: boolean }>("/health")).resolves.toEqual({ ok: true });
  });

  it("turns backend details into a typed error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ detail: "Ticket introuvable" }), { status: 404, headers: { "Content-Type": "application/json" } })));
    await expect(api("/missing")).rejects.toEqual(new ApiError("Ticket introuvable", 404));
  });
});

describe("role redirects", () => {
  it("maps every role to its dashboard", () => {
    expect(roleHome("CLIENT")).toBe("/client/dashboard");
    expect(roleHome("ADMIN")).toBe("/admin/dashboard");
    expect(roleHome("unknown")).toBe("/");
  });
});

