import { EdgeCurvedArrowProgram } from "@sigma/edge-curve";
import type { Settings } from "sigma/settings";
import type { NodeDisplayData, PartialButFor, PlainObject } from "sigma/types";

export function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawLabel(
  context: CanvasRenderingContext2D,
  data: PartialButFor<NodeDisplayData, "x" | "y" | "size" | "label" | "color">,
  settings: Settings
): void {
  if (!data.label) return;

  const size = settings.labelSize,
    font = settings.labelFont;

  context.font = `500 16px ${font}`;

  context.fillStyle = "#5e81ac";
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
  const clusterLabel = data.clusterLabel;

  // draw the label background
  context.beginPath();
  context.fillStyle = "#fff";
  context.shadowBlur = 1;
  context.shadowColor = "#2e3440";

  context.font = `500 16px ${font}`;
  const labelWidth = context.measureText(label).width;
  const clusterLabelWidth = clusterLabel
    ? context.measureText(clusterLabel).width
    : 0;

  const textWidth = Math.max(labelWidth, clusterLabelWidth);

  const x = Math.round(data.x);
  const y = Math.round(data.y);
  const w = Math.round(textWidth + size + data.size + 3);
  const hLabel = Math.round(size / 2 + 4);

  drawRoundRect(context, x - 10, y - 12, w, hLabel + 12, 5);
  context.closePath();
  context.fill();

  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 0;

  // draw the labels
  context.fillStyle = "#2e3440";
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
