import type { Meta, StoryObj } from "@storybook/react";
import UpgradeNudge from "./UpgradeNudge";

const meta: Meta<typeof UpgradeNudge> = {
  component: UpgradeNudge,
  title: "Components/UpgradeNudge",
};
export default meta;

export const Default: StoryObj<typeof UpgradeNudge> = {
  args: {},
};
