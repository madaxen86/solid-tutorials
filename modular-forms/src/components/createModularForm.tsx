import {
  createFormStore,
  FieldValues,
  FormOptions,
  FormProps,
  Form,
  ResponseData,
  Field,
  FieldProps,
  FieldArray,
  FieldArrayProps,
  FormStore,
  FieldArrayPath,
  FieldPath,
  FieldPathValue,
  MaybeValue,
  PartialKey,
} from "@modular-forms/solid";
import { ComponentProps, JSX, mergeProps } from "solid-js";

export function createModularForm<TFieldValues extends FieldValues, TResponseData extends ResponseData = undefined>(
  options?: FormOptions<TFieldValues>
): [
  FormStore<TFieldValues, TResponseData>,
  {
    Form: (props: Omit<FormProps<TFieldValues, TResponseData>, "of">) => JSX.Element;
    Field: <TFieldName extends FieldPath<TFieldValues>>(
      props: FieldPathValue<TFieldValues, TFieldName> extends MaybeValue<string>
        ? PartialKey<Omit<FieldProps<TFieldValues, TResponseData, TFieldName>, "of">, "type">
        : Omit<FieldProps<TFieldValues, TResponseData, TFieldName>, "of">
    ) => JSX.Element;
    FieldArray: <TFieldArrayName extends FieldArrayPath<TFieldValues>>(
      props: Omit<FieldArrayProps<TFieldValues, TResponseData, TFieldArrayName>, "of">
    ) => JSX.Element;
  },
];

export function createModularForm(options?: FormOptions<FieldValues>): [
  FormStore<FieldValues, ResponseData>,
  {
    Form: (props: Omit<FormProps<FieldValues, ResponseData>, "of">) => JSX.Element;
    Field: (props: Omit<FieldProps<FieldValues, ResponseData, string>, "of">) => JSX.Element;
    FieldArray: (props: Omit<FieldArrayProps<FieldValues, ResponseData, string>, "of">) => JSX.Element;
  },
] {
  // Create form store
  const form = createFormStore<FieldValues, ResponseData>(options);

  // Return form store and linked components
  return [
    form,
    {
      Form: (
        props
        // eslint-disable-next-line solid/reactivity
      ) =>
        Form(
          mergeProps({ of: form }, props, { class: "flex flex-col p-5 m-6 mx-auto max-w-[600px] gap-4 " + props.class })
        ),
      Field: (props) =>
        Field(
          // eslint-disable-next-line solid/reactivity
          mergeProps({ of: form }, props)
        ),
      FieldArray: (
        props
        // eslint-disable-next-line solid/reactivity
      ) => FieldArray(mergeProps({ of: form }, props)),
    },
  ];
}
