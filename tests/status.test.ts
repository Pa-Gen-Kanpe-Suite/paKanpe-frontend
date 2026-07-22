import { describe, expect, it } from "vitest";
import { statusLabels, statusTone } from "@/lib/status";

describe("ticket status presentation", () => {
  it("uses the semantic colors from the UX specification", () => {
    expect(statusTone("IN_PROGRESS")).toBe("success");
    expect(statusTone("WAITING")).toBe("warning");
    expect(statusTone("ABSENT")).toBe("danger");
  });

  it("uses clear French labels", () => {
    expect(statusLabels.CALLED).toBe("Appelé");
    expect(statusLabels.CLOSED).toBe("Terminé");
  });
});

