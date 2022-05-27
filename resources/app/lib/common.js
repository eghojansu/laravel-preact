export const random = (len = 8) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'

  return Array.from(crypto.getRandomValues(new Uint32Array(len))).map(r => chars[r % chars.length]).join('')
}
