export function MSColor2RGBA(color) {
  return 'rgba('
      .concat(255 * color.red(), ', ')
      .concat(255 * color.green(), ', ')
      .concat(255 * color.blue(), ', ')
      .concat(color.alpha(), ')');
}

export function MakeMSColor(color) {
  return MSImmutableColor.colorWithSVGString(color).newMutableCounterpart();
}