import type { Meta, StoryObj } from "@storybook/react";
import QuotaWidget from "./QuotaWidget";

const meta: Meta<typeof QuotaWidget> = {
  component: QuotaWidget,
  title: "Components/QuotaWidget",
};
export default meta;

export const Default: StoryObj<typeof QuotaWidget> = {
  args: {},
};
