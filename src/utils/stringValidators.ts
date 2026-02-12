export const partialNameValidator = (text: string) => /^[A-Za-z]+$/.test(text);

// Username validator: at least 3 chars, at least one letter. No other character types apart from letters, numbers, and underscores:
export const usernameValidator = (text: string) =>
  /^(?=.*[a-zA-Z])[a-zA-Z0-9_]{3,}$/.test(text);

// Password validator: min 8 characters, at least one lowercase letter, at least one uppercase letter, at least one number, at least one special character: !, @, #, $, %, ^, &, *, (, ), _
export const passwordValidator = (text: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(text);
