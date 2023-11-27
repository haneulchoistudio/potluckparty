import dotenv from "dotenv";

class ABCError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = "ABCError";
  }
}

/**
 *
 * @param key string
 * @returns string | ""
 * @description Reads the value of an environmental variable from the key `key`. If empty or not found, throws an `ABCError`
 */
export function abc(key: string) {
  dotenv.config();
  const val = process.env[key];
  if (!val)
    throw new ABCError(
      `Found out the value of your environment variable with key '${key}' is either empty "" or not added.`
    );
  return process.env[key] || "";
}
