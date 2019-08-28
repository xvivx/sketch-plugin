import requireNodobjC from './requireNodobjC';

const sha1 = require('js-sha1');

// TODO could use nodejs APIs directly
export default function makeImageDataFromUrl(url) {
  const $ = requireNodobjC();
  const pool = $.NSAutoreleasePool('alloc')('init');
  let fetchedData = url
    ? $.NSData('dataWithContentsOfURL', $.NSURL('URLWithString', $(url)))
    : undefined;

  if (fetchedData) {
    const firstByte = fetchedData('subdataWithRange', $.NSMakeRange(0, 1))('description');

    // Check for first byte. Must use non-type-exact matching (!=).
    // 0xFF = JPEG, 0x89 = PNG, 0x47 = GIF, 0x49 = TIFF, 0x4D = TIFF
    if (
      /* eslint-disable eqeqeq */
      firstByte != '<ff>' &&
      firstByte != '<89>' &&
      firstByte != '<47>' &&
      firstByte != '<49>' &&
      firstByte != '<4d>'
      /* eslint-enable eqeqeq */
    ) {
      fetchedData = null;
    }
  }

  if (!fetchedData) {
    fetchedData = $.NSData('alloc')(
      'initWithBase64EncodedString',
      $(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8w8DwHwAEOQHNmnaaOAAAAABJRU5ErkJggg==',
      ),
      'options',
      $.NSDataBase64DecodingIgnoreUnknownCharacters,
    );
  }
  const image = $.NSImage('alloc')('initWithData', fetchedData);

  const base64 = image('TIFFRepresentation')(
    'base64EncodedStringWithOptions',
    $.NSDataBase64EncodingEndLineWithCarriageReturn,
  ).toString();

  const result = {
    data: base64,
    sha1: sha1(base64),
  };

  pool('drain');

  return result;
}
