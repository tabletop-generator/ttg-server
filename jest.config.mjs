import dotenv from "dotenv";
import path from "node:path";

const envFile = path.join(import.meta.dirname, ".env.jest");
dotenv.config({ path: envFile });

console.log(
  `Using LOG_LEVEL=${process.env.LOG_LEVEL}. Use 'debug' in env.jest for more detail`,
);

/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  verbose: true,
};
