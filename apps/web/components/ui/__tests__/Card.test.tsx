import { render, screen } from "@testing-library/react";
import { Card } from "../Card";

describe("Card", () => {
  it("renders title and children", () => {
    render(<Card title="Test Card">Hello</Card>);
    expect(screen.getByText("Test Card")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
