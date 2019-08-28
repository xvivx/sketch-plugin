
// eslint-disable-next-line import/prefer-default-export
export function normalizePointInRect(point, rect) {
  const x = (point.x - rect.x) / rect.width;
  const y = (point.y - rect.y) / rect.height;
  return { x, y };
}
