import type { Settings } from "sigma/settings";
import type { NodeDisplayData, PartialButFor, PlainObject } from "sigma/types";

function drawLabel(
  context: CanvasRenderingContext2D,
  data: PartialButFor<NodeDisplayData, "x" | "y" | "size" | "label" | "color">,
  settings: Settings
): void {
  if (!data.label) return;

  const size = settings.labelSize,
    font = settings.labelFont,
    weight = settings.labelWeight;

  context.font = `${weight} ${size}px ${font}`;
  const width = context.measureText(data.label).width + 4;

  context.fillStyle = "#eceff4";
  context.fillRect(data.x + data.size, data.y + size / 3 - 15, width, 16);

  context.fillStyle = "#2e3440";
  context.fillText(data.label, data.x + data.size + 3, data.y + size / 3);
}

function drawHover(
  context: CanvasRenderingContext2D,
  data: PlainObject,
  settings: PlainObject
) {
  const size = settings.labelSize;
  const font = settings.labelFont;
  const weight = settings.labelWeight;

  const label = data.label;

  context.font = `${weight} ${size}px ${font}`;
  const width = context.measureText(data.label).width + 4;

  context.fillStyle = "#eceff4";
  context.fillRect(data.x + data.size, data.y + size / 3 - 15, width, 16);

  context.fillStyle = "#a3be8c";
  context.font = `${weight} ${size}px ${font}`;
  context.fillText(label, data.x + data.size + 3, data.y + size / 3);
}

export const sigmaSettings = {
  displayImages: true,
  allowInvalidContainer: true,
  labelFont: "Atkinson",
  defaultDrawNodeHover: drawHover,
  defaultDrawNodeLabel: drawLabel,
};
