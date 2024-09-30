import { getValue, getValues, insert, zodForm } from "@modular-forms/solid";
import { action, createAsync, json, useAction, useSubmission } from "@solidjs/router";
import { createEffect, createSignal, createUniqueId, For, onMount, Show, Suspense } from "solid-js";
import { z } from "zod";
import { createModularForm } from "~/components/createModularForm";
import Input from "~/components/Input";
import { db, getTodoById, getTodos, schema, updateDb, updateTodo, updateTodo2 } from "~/server";
export default function Home() {
  const todos = createAsync(() => getTodos());
  const todo = createAsync(() => getTodoById("1"));
  const [edit, setEdit] = createSignal("");
  const update = useAction(updateTodo);
  const sub = useSubmission(updateTodo2);
  return (
    <main class="text-center mx-auto  p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">Todos</h1>
      <pre>{JSON.stringify(todos())}</pre>
      <ul class="list-none">
        <Suspense>
          <For each={todos()}>
            {(todo) => {
              const [formStore, { Form, FieldArray, Field }] = createModularForm<z.infer<typeof schema>>({
                initialValues: todo,
                //validate: zodForm(schema),
              });
              const skills = () => getValues(formStore, "skills");
              createEffect(() => {
                console.log("skills", skills());
              });
              function addSkill() {
                const index = skills().length;
                console.log("addSkill", index);
                //return () => addField(`skills`, "", index);
                insert(formStore, `skills`, { value: "" });
              }

              console.log("mounted");
              return (
                <>
                  <p>{JSON.stringify(sub.error?.message)}</p>
                  <Show when={sub.error}>{(err) => <p class="text-red-500">{err().message}</p>}</Show>
                  <Form
                    class=""
                    onSubmit={(v) => {
                      //   console.log("onSubmit", v);
                      //   //  update(v);
                    }}
                    action={updateTodo2}
                    method="post"
                  >
                    <Field name="id">
                      {(field, props) => (
                        <Input
                          {...field}
                          {...props}
                          value={field.value || createUniqueId()}
                        />
                      )}
                    </Field>
                    <Field name="title">
                      {(field, props) => (
                        <Input
                          {...field}
                          {...props}
                        />
                      )}
                    </Field>
                    <FieldArray name="skills">
                      {(fieldArray) => (
                        <For each={fieldArray.items}>
                          {(_, index) => (
                            <Field name={`skills.${index()}`}>
                              {(field, props) => (
                                <Input
                                  {...field}
                                  {...props}
                                />
                              )}
                            </Field>
                          )}
                        </For>
                      )}
                    </FieldArray>
                    <button class="p-5 bg-green-700 text-white rounded-lg">Submit</button>
                  </Form>
                  <button
                    type="button"
                    class="p-5 bg-green-700 text-white rounded-lg"
                    onClick={() => addSkill()}
                  >
                    Add skill
                  </button>
                </>
              );
            }}
          </For>
        </Suspense>
      </ul>
      {/* <a
        href="/todos/add"
        class="block mt-8 text-sky-600 hover:underline"
      >
        Add a todo
      </a> */}
    </main>
  );
}
