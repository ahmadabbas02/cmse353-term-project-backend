import { fieldEncryptionMiddleware } from "@mindgrep/prisma-deterministic-search-field-encryption";
import { Prisma, PrismaClient } from "@prisma/client";
import CryptoJS from "crypto-js";
import sanitizedConfig from "../config";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient<Prisma.PrismaClientOptions, "info" | "warn" | "query" | "error"> | undefined;
}

let oldKey: string;
let newKey: string;

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: [
      // {
      //   emit: "stdout",
      //   level: "query",
      // },
      {
        emit: "stdout",
        level: "error",
      },
      {
        emit: "stdout",
        level: "info",
      },
      {
        emit: "stdout",
        level: "warn",
      },
    ],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

prisma.$use(
  fieldEncryptionMiddleware({
    encryptFn: (decrypted: string) => encrypt(decrypted),
    decryptFn: (encrypted: string) => decrypt(encrypted),
  }),
);

/**
 * @method encrypt
 * @param {String} plainText
 * @returns {String} encrypted string
 * @description this will encrypt the string by using DES
 */
export const encrypt = (plainText: string): string => {
  const key = CryptoJS.enc.Utf8.parse(newKey ? newKey : sanitizedConfig.ENCRYPTION_KEY);

  return CryptoJS.DES.encrypt(plainText, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
};

/**
 * @method decrypt
 * @param {String} cipherText
 * @returns {String} decrypted string
 * @description this will decrypt the string which was encrypted by DES
 */
export const decrypt = (cipherText: string): unknown => {
  const key = CryptoJS.enc.Utf8.parse(oldKey ? oldKey : sanitizedConfig.ENCRYPTION_KEY);

  return CryptoJS.DES.decrypt(cipherText, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8);
};

export const changeEncryptedValues = async (old: string, newK: string) => {
  oldKey = old;
  newKey = newK;
  const users = await prisma.user.findMany();
  const updatedUsers = await Promise.all(
    users.map(async user => {
      return await prisma.user.update({
        where: { id: user.id },
        data: { password: user.password },
      });
    }),
  );
  oldKey = undefined;
  newKey = undefined;
  return updatedUsers;
};
