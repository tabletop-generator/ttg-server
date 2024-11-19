import pluginJs from "@eslint/js";
import globals from "globals";

export default [
  { files: ["**/*.{js,mjs,cjs}"] },
  { ignores: ["coverage/"] },
  { languageOptions: { globals: { ...globals.node, ...globals.jest } } },
  pluginJs.configs.recommended,
];
