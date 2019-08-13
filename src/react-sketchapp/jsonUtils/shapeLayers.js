// @flow

import { makeResizeConstraint } from './hacksForJSONImpl';
import { generateID, makeRect } from './models';


export const makeHorizontalPath = () => ({
  _class: 'path',
  isClosed: false,
  points: [
    {
      _class: 'curvePoint',
      cornerRadius: 0,
      curveFrom: '{0, 0}',
      curveMode: 1,
      curveTo: '{0, 0}',
      hasCurveFrom: false,
      hasCurveTo: false,
      point: '{0, 0.5}',
    },
    {
      _class: 'curvePoint',
      cornerRadius: 0,
      curveFrom: '{0, 0}',
      curveMode: 1,
      curveTo: '{0, 0}',
      hasCurveFrom: false,
      hasCurveTo: false,
      point: '{1, 0.5}',
    },
  ],
});

export const makeVerticalPath = () => ({
  _class: 'path',
  isClosed: false,
  points: [
    {
      _class: 'curvePoint',
      cornerRadius: 0,
      curveFrom: '{0, 0}',
      curveMode: 1,
      curveTo: '{0, 0}',
      hasCurveFrom: false,
      hasCurveTo: false,
      point: '{0.5, 0}',
    },
    {
      _class: 'curvePoint',
      cornerRadius: 0,
      curveFrom: '{0, 0}',
      curveMode: 1,
      curveTo: '{0, 0}',
      hasCurveFrom: false,
      hasCurveTo: false,
      point: '{0.5, 1}',
    },
  ],
});

export const makeRectPath = (radii = [0, 0, 0, 0]) => {
  const [r0, r1, r2, r3] = radii;
  return {
    _class: 'path',
    isClosed: true,
    points: [
      {
        _class: 'curvePoint',
        cornerRadius: r0,
        curveFrom: '{0, 0}',
        curveMode: 1,
        curveTo: '{0, 0}',
        hasCurveFrom: false,
        hasCurveTo: false,
        point: '{0, 0}',
      },
      {
        _class: 'curvePoint',
        cornerRadius: r1,
        curveFrom: '{1, 0}',
        curveMode: 1,
        curveTo: '{1, 0}',
        hasCurveFrom: false,
        hasCurveTo: false,
        point: '{1, 0}',
      },
      {
        _class: 'curvePoint',
        cornerRadius: r2,
        curveFrom: '{1, 1}',
        curveMode: 1,
        curveTo: '{1, 1}',
        hasCurveFrom: false,
        hasCurveTo: false,
        point: '{1, 1}',
      },
      {
        _class: 'curvePoint',
        cornerRadius: r3,
        curveFrom: '{0, 1}',
        curveMode: 1,
        curveTo: '{0, 1}',
        hasCurveFrom: false,
        hasCurveTo: false,
        point: '{0, 1}',
      },
    ],
  };
};

export const makeShapePath = (
  frame,
  path,
  resizingConstraint,
) => ({
  _class: 'shapePath',
  frame,
  do_objectID: generateID(),
  isFlippedHorizontal: false,
  isFlippedVertical: false,
  isLocked: false,
  isVisible: true,
  layerListExpandedType: 0,
  name: 'Path',
  nameIsFixed: false,
  resizingConstraint: makeResizeConstraint(resizingConstraint),
  resizingType: 0,
  rotation: 0,
  shouldBreakMaskChain: false,
  booleanOperation: -1,
  edited: false,
  path,
});

export const makeRectShapeLayer = (
  x,
  y,
  width,
  height,
  radii = [0, 0, 0, 0],
  resizingConstraint,
) => {
  const fixedRadius = radii[0] || 0;
  return {
    _class: 'rectangle',
    do_objectID: generateID(),
    frame: makeRect(x, y, width, height),
    isFlippedHorizontal: false,
    isFlippedVertical: false,
    isLocked: false,
    isVisible: true,
    layerListExpandedType: 0,
    name: 'Path',
    nameIsFixed: false,
    resizingConstraint: makeResizeConstraint(resizingConstraint),
    resizingType: 0,
    rotation: 0,
    shouldBreakMaskChain: false,
    booleanOperation: -1,
    edited: false,
    path: makeRectPath(radii),
    fixedRadius,
    hasConvertedToNewRoundCorners: true,
  };
};

export const makeShapeGroup = (
  frame,
  layers = [],
  fills = [],
  resizingConstraint,
) => ({
  _class: 'shapeGroup',
  do_objectID: generateID(),
  frame,
  isLocked: false,
  isVisible: true,
  name: 'ShapeGroup',
  nameIsFixed: false,
  resizingConstraint: makeResizeConstraint(resizingConstraint),
  resizingType: 0,
  rotation: 0,
  shouldBreakMaskChain: false,
  style: {
    _class: 'style',
    endDecorationType: 0,
    fills,
    miterLimit: 10,
    startDecorationType: 0,
  },
  hasClickThrough: false,
  layers,
  clippingMaskMode: 0,
  hasClippingMask: false,
  windingRule: 1,
});
