import type { Meta, StoryObj } from "@storybook/react";
import FindingsTable from "./FindingsTable";

const meta: Meta<typeof FindingsTable> = {
  component: FindingsTable,
  title: "Components/FindingsTable",
};
export default meta;

export const Default: StoryObj<typeof FindingsTable> = {
  args: {},
};
