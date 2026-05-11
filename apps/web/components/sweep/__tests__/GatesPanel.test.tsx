import { render, screen } from "@testing-library/react";
import { GatesPanel } from "../GatesPanel";

describe("GatesPanel", () => {
  it("renders gate labels and values", () => {
    const gates = {
      safety: { value: 0, op: "==", threshold: 0, passed: true },
      mission_success: { value: 99, op: ">=", threshold: 98, passed: true },
    };
    render(<GatesPanel gates={gates} />);
    expect(screen.getByText(/Safety/)).toBeInTheDocument();
    expect(screen.getByText(/Mission success/)).toBeInTheDocument();
    expect(screen.getByText(/✓ PASS/)).toBeInTheDocument();
  });
});
