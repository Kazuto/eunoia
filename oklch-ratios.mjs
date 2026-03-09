/**
 * Calculate oklch lightness multipliers needed to match a reference color scale.
 *
 * Usage:
 *   node oklch-ratios.mjs <base-hex> <stop:hex> [<stop:hex> ...]
 *
 * Example:
 *   node oklch-ratios.mjs "#47a641" "50:#f3fbf2" "100:#e4f6e2" "200:#c9ecc6" "600:#368831"
 */

function hexToOklchL(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const toLinear = (c) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const rl = toLinear(r),
    gl = toLinear(g),
    bl = toLinear(b);

  const x = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl;
  const y = 0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl;
  const z = 0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl;

  const l = Math.cbrt(0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z);
  const m = Math.cbrt(-0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z);
  const s = Math.cbrt(0.0482003018 * x - 0.2643662691 * y + 1.2141602702 * z);

  return 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
}

const args = process.argv.slice(2);

if (args.length < 2) {
  console.log(
    "Usage: node oklch-ratios.mjs <base-hex> <stop:hex> [<stop:hex> ...]"
  );
  console.log(
    'Example: node oklch-ratios.mjs "#47a641" "50:#f3fbf2" "100:#e4f6e2"'
  );
  process.exit(1);
}

const baseHex = args[0];
const baseL = hexToOklchL(baseHex);

console.log(`Base: ${baseHex}  (L = ${baseL.toFixed(4)})\n`);
console.log("Stop  | Target  | L       | Ratio");
console.log("------|---------|---------|------");

for (const arg of args.slice(1)) {
  const [stop, hex] = arg.split(":");
  const targetL = hexToOklchL(hex);
  const ratio = targetL / baseL;
  console.log(
    `${stop.padEnd(5)} | ${hex}  | ${targetL.toFixed(4)}  | ${ratio.toFixed(2)}`
  );
}
