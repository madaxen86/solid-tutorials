import { JSX, MemoOptions, children, createMemo, untrack, Accessor } from "solid-js";

const narrowedError = (name: string) =>
  "_SOLID_DEV_"
    ? `Attempting to access a stale value from <${name}> that could possibly be undefined. This may occur because you are reading the accessor returned from the component at a time where it has already been unmounted. We recommend cleaning up any stale timers or async, or reading from the initial condition.`
    : `Stale read from <${name}>.`;

// Helper to prettify types
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

type EvalConditions = readonly [number, unknown?, MatchProps<unknown, boolean | undefined>?];

/**
 * Switches between content based on mutually exclusive conditions
 * ```typescript
 * <Switch fallback={<FourOhFour />}>
 *   <Match when={state.route === 'home'}>
 *     <Home />
 *   </Match>
 *   <Match when={state.route === 'settings'}>
 *     <Settings />
 *   </Match>
 * </Switch>
 * ```
 * @description https://docs.solidjs.com/reference/components/switch-and-match
 */
export function Switch(props: { fallback?: JSX.Element; children: JSX.Element }): JSX.Element {
  let keyed = false;
  const equals: MemoOptions<EvalConditions>["equals"] = (a, b) =>
    (keyed ? a[1] === b[1] : !a[1] === !b[1]) && a[2] === b[2];
  const conditions = children(() => props.children) as unknown as () => MatchProps<unknown, boolean | undefined>[],
    evalConditions = createMemo(
      (): EvalConditions => {
        let conds = conditions();
        if (!Array.isArray(conds)) conds = [conds];
        for (let i = 0; i < conds.length; i++) {
          const c = conds[i].when;
          if (c) {
            keyed = !!conds[i].keyed;
            return [i, c, conds[i]];
          }
        }
        return [-1];
      },
      undefined,
      "_SOLID_DEV_" ? { equals, name: "eval conditions" } : { equals }
    );
  return createMemo(
    () => {
      const [index, when, cond] = evalConditions();
      if (index < 0) return props.fallback;
      const c = cond!.children;
      const fn = typeof c === "function" && c.length > 0;
      return fn
        ? untrack(() =>
            (c as any)(
              keyed
                ? when
                : () => {
                    if (untrack(evalConditions)[0] !== index) throw narrowedError("Match");
                    return cond!.when;
                  }
            )
          )
        : c;
    },
    undefined,
    "_SOLID_DEV_" ? { name: "value" } : undefined
  ) as unknown as JSX.Element;
}

export type MatchProps<T, CheckObjectValues extends boolean | undefined> = {
  when: T | undefined | null | false;
  keyed?: boolean;
  children:
    | JSX.Element
    | ((
        item:
          | NonNullable<NarrowedRecord<T, CheckObjectValues>>
          | Accessor<NonNullable<NarrowedRecord<T, CheckObjectValues>>>
      ) => JSX.Element);
};
/**
 * Selects a content based on condition when inside a `<Switch>` control flow
 * ```typescript
 * <Match when={condition()}>
 *   <Content/>
 * </Match>
 * ```
 * @description https://docs.solidjs.com/reference/components/switch-and-match
 */
export function Match<
  T,
  CheckObjectValues extends boolean | undefined,
  TRenderFunction extends (item: Accessor<Prettify<NonNullable<NarrowedRecord<T, CheckObjectValues>>>>) => JSX.Element,
>(props: {
  when: EnforceStrictKeyValueObject<T, CheckObjectValues>;
  keyed?: false;
  checkObjectValues?: CheckObjectValues;
  children: JSX.Element | RequiredParameter<TRenderFunction>;
}): JSX.Element;
export function Match<
  T,
  CheckObjectValues extends boolean | undefined,
  TRenderFunction extends (item: Prettify<NonNullable<NarrowedRecord<T, CheckObjectValues>>>) => JSX.Element,
>(props: {
  when: EnforceStrictKeyValueObject<T, CheckObjectValues>;
  keyed: true;
  checkObjectValues?: CheckObjectValues;
  children: JSX.Element | RequiredParameter<TRenderFunction>;
}): JSX.Element;
export function Match<T>(props: MatchProps<T, undefined>) {
  return props as unknown as JSX.Element;
}
