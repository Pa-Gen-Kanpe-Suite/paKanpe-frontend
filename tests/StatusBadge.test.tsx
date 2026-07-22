import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "@/components/StatusBadge";

describe("StatusBadge", () => {
  it("renders an accessible status label", () => {
    render(<StatusBadge status="ABSENT" />);
    expect(screen.getByText("Absent")).toHaveClass("danger");
  });
});

