
export function describePoint(point) {
  const { x, y } = point;
  return `{${x}, ${y}}`;
}

export function makeCurvePoint(
  point,
  curveFrom,
  curveTo,
  curveMode,
) {
  return {
    _class: 'curvePoint',
    cornerRadius: 0,
    curveFrom: describePoint(curveFrom || point),
    curveMode,
    curveTo: describePoint(curveTo || point),
    hasCurveFrom: !!curveFrom,
    hasCurveTo: !!curveTo,
    point: describePoint(point),
  };
}
