import { Accessor, createMemo, JSX, untrack } from "solid-js";
const narrowedError = (name: string) =>
  "_SOLID_DEV_"
    ? `Attempting to access a stale value from <${name}> that could possibly be undefined. This may occur because you are reading the accessor returned from the component at a time where it has already been unmounted. We recommend cleaning up any stale timers or async, or reading from the initial condition.`
    : `Stale read from <${name}>.`;

type RequiredParameter<T> = T extends () => unknown ? never : T;
/**
 * Conditionally render its children or an optional fallback component
 * @description https://docs.solidjs.com/reference/components/show
 */

export function all<
  const T,
  TAccessors extends Array<Accessor<T> | T>,
  const TValues extends {
    [TKey in keyof TAccessors]: TAccessors[TKey] extends () => any
      ? Exclude<ReturnType<TAccessors[TKey]>, null | undefined | false>
      : Exclude<TAccessors[TKey], null | undefined | false>;
  },
>(...accessors: TAccessors): TValues | undefined {
  const values = new Array(accessors.length);

  for (let i = 0; i < accessors.length; i++) {
    const _value = typeof accessors[i] === "function" ? (accessors[i] as () => T)() : accessors[i];
    if (!_value) return undefined;
    values[i] = _value;
  }

  return values as TValues;
}

export function Show<T, TRenderFunction extends (item: Accessor<NonNullable<T>>) => JSX.Element>(props: {
  when: T | undefined | null | false;
  keyed?: false;
  fallback?: JSX.Element;
  children: JSX.Element | RequiredParameter<TRenderFunction>;
}): JSX.Element;
export function Show<T, TRenderFunction extends (item: NonNullable<T>) => JSX.Element>(props: {
  when: T | undefined | null | false;
  keyed: true;
  fallback?: JSX.Element;
  children: JSX.Element | RequiredParameter<TRenderFunction>;
}): JSX.Element;
export function Show<T>(props: {
  when: T | undefined | null | false;
  keyed?: boolean;
  fallback?: JSX.Element;
  children: JSX.Element | ((item: NonNullable<T> | Accessor<NonNullable<T>>) => JSX.Element);
}): JSX.Element {
  const keyed = props.keyed;
  const condition = createMemo<T | undefined | null | boolean>(
    () => props.when,
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
                      if (!untrack(condition)) throw narrowedError("Show");
                      return props.when;
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
