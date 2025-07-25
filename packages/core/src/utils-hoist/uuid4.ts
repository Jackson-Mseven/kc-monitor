export function uuid4(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16))

  // Set version (4)
  bytes[6] = (bytes[6] & 0x0f) | 0x40

  // Set variant (10)
  bytes[8] = (bytes[8] & 0x3f) | 0x80

  const toHex = (b: number) => b.toString(16).padStart(2, '0')

  return [
    [...bytes.slice(0, 4)].map(toHex).join(''),
    [...bytes.slice(4, 6)].map(toHex).join(''),
    [...bytes.slice(6, 8)].map(toHex).join(''),
    [...bytes.slice(8, 10)].map(toHex).join(''),
    [...bytes.slice(10, 16)].map(toHex).join(''),
  ].join('-')
}
