import * as dotenv from "dotenv";
import * as fs from "fs";
import { randomBytes } from "crypto";
import { changeEncryptedValues } from "../utils/db";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

interface ENV {
  PORT: number | undefined;
  DATABASE_URL: string | undefined;
  ENCRYPTION_KEY: string | undefined;
  SECRET_KEY: string | undefined;
  LOG_FORMAT: string | undefined;
  LOG_DIR: string | undefined;
  ORIGIN: string | undefined;
  CREDENTIALS: boolean | undefined;
}

interface Config {
  PORT: number;
  DATABASE_URL: string;
  ENCRYPTION_KEY: string;
  SECRET_KEY: string;
  LOG_FORMAT: string;
  LOG_DIR: string;
  ORIGIN: string;
  CREDENTIALS: boolean;
}

// Loading process.env as ENV interface

const getConfig = (): ENV => {
  return {
    PORT: Number(process.env.PORT),
    DATABASE_URL: process.env.DATABASE_URL,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    SECRET_KEY: process.env.SECRET_KEY,
    LOG_FORMAT: process.env.LOG_FORMAT,
    LOG_DIR: process.env.LOG_DIR,
    ORIGIN: process.env.ORIGIN,
    CREDENTIALS: Boolean(process.env.CREDENTIALS),
  };
};

// Throwing an Error if any field was undefined we don't
// want our app to run if it can't connect to DB and ensure
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type
// definition.

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export const changeSecretKey = async () => {
  const oldKey = sanitizedConfig.ENCRYPTION_KEY;
  const newKey = randomBytes(16).toString("hex");
  sanitizedConfig.ENCRYPTION_KEY = newKey;

  const envContent = fs
    .readFileSync(`.env.${process.env.NODE_ENV || "development"}.local`)
    .toString("utf-8")
    .split("\n");

  // Replace line with new key
  for (let index = 0; index < envContent.length; index++) {
    const line = envContent[index];
    if (line.startsWith("ENCRYPTION_KEY = ")) {
      envContent[index] = `ENCRYPTION_KEY = ${newKey}`;
      break;
    }
  }

  fs.writeFileSync(`.env.${process.env.NODE_ENV || "development"}.local`, envContent.join("\n"));

  return await changeEncryptedValues(oldKey, newKey);
};

export default sanitizedConfig;
