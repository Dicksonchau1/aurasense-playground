import React from 'react'
import type { Meta, StoryObj } from "@storybook/react";
import RehearsalProgress from "./RehearsalProgress";

const meta: Meta<typeof RehearsalProgress> = {
  component: RehearsalProgress,
  title: "Components/RehearsalProgress",
};
export default meta;

export const Default: StoryObj<typeof RehearsalProgress> = {
  args: {},
};
