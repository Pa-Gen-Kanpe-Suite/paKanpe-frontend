import { describe, expect, it } from "vitest";
import { isAllowedProxyRoute } from "@/lib/proxy-allowlist";

describe("proxy route allowlist", () => {
  it("allows the read-only routes currently used by the UI", () => {
    expect(isAllowedProxyRoute("GET", "/services")).toBe(true);
    expect(isAllowedProxyRoute("GET", "/display")).toBe(true);
    expect(isAllowedProxyRoute("GET", "/queues/position/ABC123")).toBe(true);
    expect(isAllowedProxyRoute("GET", "/auth/me")).toBe(true);
  });

  it("rejects unexpected GET routes and traversal attempts", () => {
    expect(isAllowedProxyRoute("GET", "/admin/users")).toBe(false);
    expect(isAllowedProxyRoute("GET", "/../admin/users")).toBe(false);
    expect(isAllowedProxyRoute("POST", "/admin/users")).toBe(false);
  });
});
