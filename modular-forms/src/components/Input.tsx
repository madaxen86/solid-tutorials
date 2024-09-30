import { Component, ComponentProps, splitProps } from "solid-js";
const Input: Component<ComponentProps<"input"> & { error?: string }> = (props) => {
  const [local, inputProps] = splitProps(props, ["class", "error"]);
  return (
    <>
      <label for={inputProps.name}>{inputProps.name?.toUpperCase()}</label>
      <input
        {...inputProps}
        class={`w-full rounded p-2 bg-transparent border ${local.class}`}
        classList={{ "border-red-600 outline-red-600": !!local.error }}
      />
      <p class="text-red-600 ">{local.error}</p>
    </>
  );
};
export default Input;
