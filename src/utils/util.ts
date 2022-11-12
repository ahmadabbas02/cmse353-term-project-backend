import CryptoJS from "crypto-js";

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== "number" && value === "") {
    return true;
  } else if (typeof value === "undefined" || value === undefined) {
    return true;
  } else if (value !== null && typeof value === "object" && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

/**
 * @method encrypt
 * @param {String} plainText
 * @returns {String} encrypted string
 * @description this will encrypt the string by using DES
 */
export const encrypt = (plainText: string): string => {
  const key = CryptoJS.enc.Utf8.parse(process.env.ENCRYPTION_KEY);
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
  const key = CryptoJS.enc.Utf8.parse(process.env.ENCRYPTION_KEY);
  return CryptoJS.DES.decrypt(cipherText, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8);
};

// Exclude keys from user
export const excludeFromUser = <User, Key extends keyof User>(user: User, ...keys: Key[]) => {
  for (const key of keys) {
    delete user[key];
  }
  return user;
};

// Exclude keys from user[]
export const excludeFromUsers = <User, Key extends keyof User>(users: User[], ...keys: Key[]) => {
  return users.map(user => {
    for (const key of keys) {
      delete user[key];
    }
    return user;
  });
};
