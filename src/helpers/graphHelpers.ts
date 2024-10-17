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

/**
 * Custom hover renderer
 */
export function drawHover(
  context: CanvasRenderingContext2D,
  data: PlainObject,
  settings: PlainObject
) {
  const size = 16;
  const font = settings.labelFont;
  const weight = settings.labelWeight;

  const label = data.label;

  // draw label background
  context.beginPath();
  context.fillStyle = "#eceff4";

  context.font = `${weight} ${size}px ${font}`;
  const labelWidth = context.measureText(label).width;
  const textWidth = Math.max(labelWidth);

  const x = Math.round(data.x);
  const y = Math.round(data.y);
  const w = Math.round(textWidth + size / 2 + data.size + 3);
  const hLabel = Math.round(size / 2 + 4);

  drawRoundRect(context, x, y - 12, w, hLabel + 10, 5);
  context.closePath();
  context.fill();

  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 0;

  // draw label
  context.fillStyle = "#5ca35c";
  context.font = `${weight} ${size}px ${font}`;
  context.fillText(data.label, data.x + data.size + 3, data.y + size / 3);
}

function drawLabel(
  context: CanvasRenderingContext2D,
  data: PartialButFor<NodeDisplayData, "x" | "y" | "size" | "label" | "color">,
  settings: Settings
): void {
  if (!data.label) return;

  const size = 16,
    font = settings.labelFont;

  context.font = `500 16px ${font}`;

  context.fillStyle = "#2e3440";
  context.fillText(data.label, data.x + data.size + 3, data.y + size / 3);
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
