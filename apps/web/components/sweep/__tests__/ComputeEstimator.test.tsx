import { render, screen } from "@testing-library/react";
import { ComputeEstimator } from "../ComputeEstimator";

describe("ComputeEstimator", () => {
  it("renders compute estimate values", () => {
    render(<ComputeEstimator cells={1000} episodeSeconds={180} realtimeFactor={5} />);
    expect(screen.getByText(/Cells/)).toBeInTheDocument();
    expect(screen.getByText(/GPU-min/)).toBeInTheDocument();
    expect(screen.getByText(/Wall · 1× A100/)).toBeInTheDocument();
    expect(screen.getByText(/Cost/)).toBeInTheDocument();
  });
});
