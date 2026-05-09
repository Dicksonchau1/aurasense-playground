import type { Meta, StoryObj } from "@storybook/react";
import AuditTimeline from "./AuditTimeline";

const meta: Meta<typeof AuditTimeline> = {
  component: AuditTimeline,
  title: "Components/AuditTimeline",
};
export default meta;

export const Default: StoryObj<typeof AuditTimeline> = {
  args: {},
};
