import { Accessor, createMemo, JSX, untrack } from "solid-js";

// Helper to prettify types in errors
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

// Helper to make all values non-nullable
type NonNullableValues<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

// Strict object type to exclude arrays, maps, sets, and functions
type StrictKeyValueObject = {
  [key: string]: string | number | boolean | object | null | undefined;
};

// ConditionalRecord ensures that when `checkObjectValues` is true, `T` must be a StrictKeyValueObject (not an array or other types)
type NarrowedRecord<T, CheckObjectValues extends boolean | undefined> = CheckObjectValues extends true
  ? T extends StrictKeyValueObject
    ? NonNullableValues<T> // Ensure all values are NonNullable
    : never // Throw an error if not a strict object
  : T;

// Enforce when to be a StrictKeyValueObject if checkObjectValues is true
type EnforceStrictKeyValueObject<T, CheckObjectValues extends boolean | undefined> = CheckObjectValues extends true
  ? T extends StrictKeyValueObject
    ? T
    : never // Enforce strict key-value object when checkObjectValues is true
  : T;

// RequiredParameter helper
type RequiredParameter<T> = T extends () => unknown ? never : T;

export function Show<
  T,
  CheckObjectValues extends boolean | undefined,
  TRenderFunction extends (item: Accessor<Prettify<NonNullable<NarrowedRecord<T, CheckObjectValues>>>>) => JSX.Element,
>(props: {
  when: EnforceStrictKeyValueObject<T, CheckObjectValues>;
  keyed?: false;
  checkObjectValues?: CheckObjectValues;
  fallback?: JSX.Element;
  children: JSX.Element | RequiredParameter<TRenderFunction>;
}): JSX.Element;

export function Show<
  T,
  CheckObjectValues extends boolean | undefined,
  TRenderFunction extends (item: Prettify<NonNullable<NarrowedRecord<T, CheckObjectValues>>>) => JSX.Element,
>(props: {
  when: EnforceStrictKeyValueObject<T, CheckObjectValues>;
  keyed: true;
  checkObjectValues?: CheckObjectValues;
  fallback?: JSX.Element;
  children: JSX.Element | RequiredParameter<TRenderFunction>;
}): JSX.Element;

export function Show<T, CheckObjectValues extends boolean | undefined>(props: {
  when: EnforceStrictKeyValueObject<T, CheckObjectValues>;
  keyed?: boolean;
  checkObjectValues?: CheckObjectValues;
  fallback?: JSX.Element;
  children:
    | JSX.Element
    | ((
        item:
          | NonNullable<NarrowedRecord<T, CheckObjectValues>>
          | Accessor<NonNullable<NarrowedRecord<T, CheckObjectValues>>>
      ) => JSX.Element);
}): JSX.Element {
  const keyed = props.keyed;

  // Memoize the condition based on whether checkObjectValues is true or not
  const condition = createMemo(
    () => {
      const when = props.when;
      if (!props.checkObjectValues) return when;
      // Check if all values in `when` are truthy
      return Object.values(when as Record<string, any>).every((value) => !!value) ? when : false;
    },
    undefined,
    "_SOLID_DEV_"
      ? {
          equals: (a, b) => (keyed ? a === b : !a === !b),
          name: "condition",
        }
      : { equals: (a, b) => (keyed ? a === b : !a === !b) }
  );

  return createMemo(
    () => {
      const c = condition();
      if (c) {
        const child = props.children;
        const fn = typeof child === "function" && child.length > 0;
        return fn
          ? untrack(() =>
              (child as any)(
                keyed
                  ? (c as T)
                  : () => {
                      if (!untrack(condition)) throw new Error("Show");
                      return condition() as T;
                    }
              )
            )
          : child;
      }
      return props.fallback;
    },
    undefined,
    "_SOLID_DEV_" ? { name: "value" } : undefined
  ) as unknown as JSX.Element;
}
