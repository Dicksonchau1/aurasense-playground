import { render, screen, fireEvent } from "@testing-library/react";
import { Slider, Switch, Select } from "../inputs";

describe("Slider", () => {
  it("renders and changes value", () => {
    const handleChange = jest.fn();
    render(<Slider label="Test Slider" value={5} min={0} max={10} onChange={handleChange} />);
    expect(screen.getByText("Test Slider")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("slider"), { target: { value: 7 } });
    expect(handleChange).toHaveBeenCalledWith(7);
  });
});

describe("Switch", () => {
  it("renders and toggles", () => {
    const handleChange = jest.fn();
    render(<Switch label="Test Switch" checked={false} onChange={handleChange} />);
    expect(screen.getByText("Test Switch")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Test Switch"));
    expect(handleChange).toHaveBeenCalledWith(true);
  });
});

describe("Select", () => {
  it("renders and changes option", () => {
    const handleChange = jest.fn();
    render(<Select label="Test Select" value="a" options={[{v:"a",l:"A"},{v:"b",l:"B"}]} onChange={handleChange} />);
    expect(screen.getByText("Test Select")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "b" } });
    expect(handleChange).toHaveBeenCalledWith("b");
  });
});
