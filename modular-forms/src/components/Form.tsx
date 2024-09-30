import { ComponentProps, ParentComponent, splitProps } from "solid-js";
const Form: ParentComponent<ComponentProps<"form">> = (props) => {
  const [local, formProps] = splitProps(props, ["class"]);
  return (
    <form
      {...props}
      class={`flex flex-col p-5 m-6 mx-auto max-w-[600px] gap-4 ${local.class}`}
      {...formProps}
    />
  );
};
export default Form;
