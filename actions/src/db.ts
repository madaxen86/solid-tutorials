import fs from "fs";

/**
 * db mock
 */
type User = {
  id: string;
  name: string;
  skills: string;
};
async function readUser(): Promise<User> {
  const text = await fs.promises.readFile("./user.json", { encoding: "utf-8" });
  return JSON.parse(text);
}
async function writeUser(user: User) {
  await fs.promises.writeFile("./user.json", JSON.stringify(user));
}
export const db = {
  queryUser: readUser,
  updateUser: writeUser,
};
export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
