import { action, cache, json, redirect, reload } from "@solidjs/router";
import { object, z } from "zod";
import fs from "fs";
import path from "path";
import { zodForm } from "@modular-forms/solid";

export const schema = z.object({
  id: z.string(),
  title: z.string().min(3),
  skills: z.array(z.string().min(3)), //.optional(),
});
type Schema = z.infer<typeof schema>;

export const db = () => z.array(schema).parse(JSON.parse(fs.readFileSync(path.resolve("./src/db.json"), "utf-8")));
export const updateDb = (data: any) => fs.writeFileSync(path.resolve("./src/db.json"), JSON.stringify(data));

export const getTodoById = cache(async (id: string) => {
  return db().find((todo) => todo.id === id);
}, "getTodoById");

export const getTodos = cache(async () => {
  "use server";
  console.log("getTodos");
  return db();
}, "getTodos");

export const addTodo = action(async (formData: Schema) => {
  "use server";
  console.log(formData);
  updateDb([...db(), formData]);
  return redirect("/", { revalidate: [getTodos.key] });
});

export const updateTodo = action(async (formData: Schema) => {
  "use server";
  schema.parse(formData);
  console.log("updateTodo #####", formData);
  updateDb(db().map((todo) => (todo.id === formData.id ? formData : todo)));
  return json("update", { revalidate: [getTodos.key] });
}, "update");

export const updateTodo2 = action(async (data: FormData) => {
  "use server";
  const form = {
    id: data.get("id")?.toString(),
    title: data.get("title")?.toString(),
    skills: data.get("skills.0")?.toString().split(","),
  };
  console.log("updateTodo2", form);
  const formData = schema.safeParse(form);
  const vd = zodForm(schema)(form);
  console.log("#####", vd);

  if (formData.error) throw vd;

  updateDb(db().map((todo) => (todo.id === formData.data.id ? formData.data : todo)));
  return json("updated2", { revalidate: [getTodos.key] });
}, "updateTodo");
