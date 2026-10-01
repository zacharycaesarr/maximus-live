/** Full-resolution, pixel-identical encodings of the approved PNGs. Keep tuner
 * paths and custom images intact; only these verified assets use the smaller copy. */
const losslessCopies: Record<string, string> = {
  '/products/camerarig.png': '/products/camerarig.lossless.webp',
  '/products/MR-headphones.png': '/products/MR-headphones.lossless.webp',
  '/products/gooey-mrsmooth.png': '/products/gooey-mrsmooth.lossless.webp',
}

export function serviceImageSource(source: string) { return losslessCopies[source] ?? source }
