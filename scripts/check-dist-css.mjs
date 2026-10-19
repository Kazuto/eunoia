// Fails the publish when dist/eunoia.css was compiled by Tailwind instead of shipped
// as source. Consuming apps compile it themselves and need these directives; without
// @source their Tailwind never generates the classes the components use.
import { readFileSync } from "node:fs";

const file = new URL("../dist/eunoia.css", import.meta.url);
let css;
try {
  css = readFileSync(file, "utf8");
} catch {
  console.error(
    `check-dist-css: ${file.pathname} is missing; run the build first.`
  );
  process.exit(1);
}

const required = ["@source", "@theme", "@custom-variant dark", "@utility"];
const problems = required
  .filter((directive) => !css.includes(directive))
  .map((directive) => `missing ${directive}`);
if (/tailwindcss v\d/.test(css)) {
  problems.push("compiled by Tailwind (found its license header)");
}

if (problems.length) {
  console.error(
    `check-dist-css: dist/eunoia.css can't be used by apps (${problems.join(", ")}).\n` +
      "Something in stories/styles.css made the build compile it, e.g. an @apply."
  );
  process.exit(1);
}
console.log(
  "check-dist-css: dist/eunoia.css ships Tailwind source as expected."
);
