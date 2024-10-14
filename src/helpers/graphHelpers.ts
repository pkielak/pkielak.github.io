import { EdgeCurvedArrowProgram } from "@sigma/edge-curve";
import type { Settings } from "sigma/settings";
import type { NodeDisplayData, PartialButFor, PlainObject } from "sigma/types";

function drawLabel(
  context: CanvasRenderingContext2D,
  data: PartialButFor<NodeDisplayData, "x" | "y" | "size" | "label" | "color">,
  settings: Settings
): void {
  if (!data.label) return;

  const size = settings.labelSize,
    font = settings.labelFont;

  context.font = `500 16px ${font}`;

  context.fillStyle = "#2e3440";
  context.fillText(data.label, data.x + data.size + 3, data.y + size / 3);
}

export function drawHover(
  context: CanvasRenderingContext2D,
  data: PlainObject,
  settings: PlainObject
) {
  const size = settings.labelSize;
  const font = settings.labelFont;
  const label = data.label;

  // draw the labels
  context.fillStyle = "#a3be8c";
  context.font = `500 16px ${font}`;
  context.fillText(label, data.x + data.size + 3, data.y + size / 3);
}

export const sigmaSettings = {
  displayImages: true,
  allowInvalidContainer: true,
  labelFont: "Atkinson",
  defaultEdgeType: "curved",
  edgeProgramClasses: {
    curved: EdgeCurvedArrowProgram,
  },
  defaultDrawNodeHover: drawHover,
  defaultDrawNodeLabel: drawLabel,
};
