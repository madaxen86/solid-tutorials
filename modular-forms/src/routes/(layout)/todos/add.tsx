import { createForm, getError, getErrors, getValues, zodForm } from "@modular-forms/solid";
import { useAction, useSubmission } from "@solidjs/router";
import { Component, ComponentProps, For, Index } from "solid-js";
import { z } from "zod";
import Input from "~/components/Input";
import { addTodo, schema } from "~/server";

type FormData = z.infer<typeof schema>;
type Keys = keyof FormData;
const Add: Component = (props) => {
  const action = useAction(addTodo);
  const submission = useSubmission(addTodo);

  const [store, { Form, Field }] = createForm<FormData>({
    validate: zodForm(schema),
  });

  return (
    <Form
      onInvalid={() => console.log("invalid")}
      onError={() => console.log("error")}
      onSubmit={(v) => {
        console.log(v);

        action(v);
      }}
    >
      <pre>{JSON.stringify(getValues(store))}</pre>
      <pre>{JSON.stringify(getError(store, "skills"))}</pre>
      <For each={["id", "title", "skills.0"] as const}>
        {(item) => (
          <Field name={item}>
            {(field, props) => (
              <Input
                {...props}
                {...field}
                //error={submission?.error?.[field.name]?.join(", ") + field.error}
              />
            )}
          </Field>
        )}
      </For>

      <button
        class="p-5 bg-sky-700 text-white rounded-lg"
        type="submit"
        onClick={() => console.log("CLICK")}
      >
        Add todo
      </button>
    </Form>
  );
};
export default Add;
