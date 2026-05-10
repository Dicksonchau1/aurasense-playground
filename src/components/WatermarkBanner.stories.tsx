import React from 'react'
import type { Meta, StoryObj } from "@storybook/react";
import WatermarkBanner from "./WatermarkBanner";

const meta: Meta<typeof WatermarkBanner> = {
  component: WatermarkBanner,
  title: "Components/WatermarkBanner",
};
export default meta;

export const Default: StoryObj<typeof WatermarkBanner> = {
  args: {},
};
