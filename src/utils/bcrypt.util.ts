import bcrypt from "bcryptjs";
export const hash = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const compare = async (plainString: string, hashedString: string) => {
  const isMatch = await bcrypt.compare(plainString, hashedString);
  return isMatch;
};
