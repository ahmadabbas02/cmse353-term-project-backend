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
