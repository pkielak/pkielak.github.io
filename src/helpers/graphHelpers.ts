import type { SigmaContainerProps } from "@react-sigma/core";
import { EdgeCurvedArrowProgram } from "@sigma/edge-curve";
import type { Attributes } from "graphology-types";
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
  const hoverColor = "#5ca35c";
  const textSize = 16;
  const font = settings.labelFont;
  const weight = settings.labelWeight;
  const nodeSize = data.size;
  const label = data.label;
  const x = Math.round(data.x);
  const y = Math.round(data.y);

  // Label background
  context.beginPath();
  context.fillStyle = "#eceff4";

  context.font = `${weight} ${textSize}px ${font}`;
  const labelWidth = context.measureText(label).width;
  const textWidth = Math.max(labelWidth);

  const w = Math.round(textWidth + textSize / 2 + data.size - 2);
  const hLabel = Math.round(textSize / 2 + 4);

  drawRoundRect(context, x, y - 12, w, hLabel + 10, 5);
  context.closePath();
  context.fill();

  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 0;

  // Node hover
  context.fillStyle = hoverColor;
  context.beginPath();
  context.arc(data.x, data.y, nodeSize + 2, 0, Math.PI);
  context.arc(data.x, data.y, nodeSize + 2, Math.PI, Math.PI * 2);
  context.closePath();
  context.fill();

  // Label
  context.fillStyle = hoverColor;
  context.font = `${weight} ${textSize}px ${font}`;
  context.fillText(data.label, data.x + data.size + 3, data.y + textSize / 3);
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

export const sigmaProps = {
  settings: {
    displayImages: true,
    allowInvalidContainer: true,
    labelFont: "Atkinson",
    defaultEdgeType: "curved",
    edgeProgramClasses: {
      curved: EdgeCurvedArrowProgram,
    },
    defaultDrawNodeHover: drawHover,
    defaultDrawNodeLabel: drawLabel,
  },
} as SigmaContainerProps<Attributes, Attributes, Attributes>;
