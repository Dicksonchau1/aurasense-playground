import type { Meta, StoryObj } from "@storybook/react";
import EdSignatureChip from "./EdSignatureChip";

const meta: Meta<typeof EdSignatureChip> = {
  component: EdSignatureChip,
  title: "Components/EdSignatureChip",
};
export default meta;

export const Default: StoryObj<typeof EdSignatureChip> = {
  args: {},
};
