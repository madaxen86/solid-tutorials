import { Accessor, JSX, MemoOptions, children, createEffect, createMemo, untrack } from "solid-js";
import { createMutable, createStore, modifyMutable, reconcile, StoreNode, unwrap } from "solid-js/store";
const narrowedError = (name: string) =>
  "_SOLID_DEV_"
    ? `Attempting to access a stale value from <${name}> that could possibly be undefined. This may occur because you are reading the accessor returned from the component at a time where it has already been unmounted. We recommend cleaning up any stale timers or async, or reading from the initial condition.`
    : `Stale read from <${name}>.`;

// Helper to prettify types
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type NonNullable<T> = T extends null | undefined | false | 0 ? never : T;
// Helper to make all values non-nullable
type NonNullableValues<T> = {
  [K in keyof T]: NonNullable<T[K]>; // extends null | undefined | false ? never : T[K];
};

// Strict object type to exclude arrays, maps, sets, and functions
type StrictKeyValueObject = {
  [key: string]: string | number | boolean | object | null | undefined;
};

type SwitchEval<T> = MemoOptions<false | T | StrictKeyValueObject | null | undefined>["equals"];

type RequiredParameter<T> = T extends () => unknown ? never : T;
/**
 * Conditionally render its children or an optional fallback component
 * @description https://docs.solidjs.com/reference/components/show
 */
export function Show<T, TRenderFunction extends (item: Accessor<NonNullable<T>>) => JSX.Element>(props: {
  when: T | undefined | null | false;
  keyed?: false;
  checkObjectValues?: false;
  fallback?: JSX.Element;
  children: JSX.Element | RequiredParameter<TRenderFunction>;
}): JSX.Element;
export function Show<
  T extends StrictKeyValueObject,
  TRenderFunction extends (item: Accessor<Prettify<NonNullableValues<T>>>) => JSX.Element,
>(props: {
  when: T;
  keyed?: false;
  checkObjectValues: true;
  fallback?: JSX.Element;
  children: JSX.Element | RequiredParameter<TRenderFunction>;
}): JSX.Element;
export function Show<T, TRenderFunction extends (item: NonNullable<T>) => JSX.Element>(props: {
  when: T | undefined | null | false;
  keyed: true;
  checkObjectValues?: false;
  fallback?: JSX.Element;
  children: JSX.Element | RequiredParameter<TRenderFunction>;
}): JSX.Element;
export function Show<
  T extends StrictKeyValueObject,
  TRenderFunction extends (item: Prettify<NonNullableValues<T>>) => JSX.Element,
>(props: {
  when: T;
  keyed?: boolean;
  checkObjectValues: true;
  fallback?: JSX.Element;
  children: JSX.Element | RequiredParameter<TRenderFunction>;
}): JSX.Element;
export function Show<T>(props: {
  when: T | undefined | null | false;
  keyed?: boolean;
  checkObjectValues?: boolean;
  fallback?: JSX.Element;
  children:
    | JSX.Element
    | ((
        item:
          | NonNullable<T>
          | Accessor<NonNullable<T>>
          | Accessor<Prettify<NonNullableValues<T>>>
          | Prettify<NonNullableValues<T>>
      ) => JSX.Element);
}): JSX.Element {
  const equals: SwitchEval<T> = (a, b) => {
    if (obj) {
      const obj1 = a as StrictKeyValueObject;
      const obj2 = b as StrictKeyValueObject;
      const o1 = Object.entries(obj1);
      const o2 = Object.entries(obj2);
      if (o1.length !== o2.length) {
        return false;
      }

      return o1.every(([key, value]) => obj2.hasOwnProperty(key) && obj2[key] === value);
    }
    return keyed ? a === b : !a === !b;
  };

  const keyed = props.keyed;
  const obj = props.checkObjectValues;
  const s = obj ? createStore(props.when as StrictKeyValueObject) : null;
  const condition = createMemo(
    () => {
      const when = props.when;
      if (!obj) return when;
      if (!Object.values(when as StrictKeyValueObject).every((v) => !!v)) return false;
      if (!s) throw new Error("Show");
      const [v, setV] = s;
      setV(reconcile(when as StrictKeyValueObject));
      return v;
    },
    undefined,
    "_SOLID_DEV_"
      ? {
          equals,
          name: "condition",
        }
      : {
          equals,
        }
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

type EvalConditions = readonly [number, unknown?, MatchProps<unknown>?];

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
  const conditions = children(() => props.children) as unknown as () => MatchProps<unknown>[],
    evalConditions = createMemo(
      (): EvalConditions => {
        let conds = conditions();
        if (!Array.isArray(conds)) conds = [conds];
        for (let i = 0; i < conds.length; i++) {
          const c = conds[i].when;
          const o = conds[i].checkObjectValues;
          if ((!o && c) || (o && Object.values(c as Record<string, any>).every((value) => !!value))) {
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

export type MatchProps<T> = {
  when: T | undefined | null | false;
  keyed?: boolean;
  checkObjectValues?: boolean;
  children:
    | JSX.Element
    | ((
        item:
          | NonNullable<T>
          | Accessor<NonNullable<T>>
          | Prettify<NonNullableValues<T>>
          | Accessor<Prettify<NonNullableValues<T>>>
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
export function Match<T, TRenderFunction extends (item: Accessor<NonNullable<T>>) => JSX.Element>(props: {
  when: T | undefined | null | false;
  keyed?: false;
  checkObjectValues?: false;
  children: JSX.Element | RequiredParameter<TRenderFunction>;
}): JSX.Element;
export function Match<T, TRenderFunction extends (item: NonNullable<T>) => JSX.Element>(props: {
  when: T | undefined | null | false;
  keyed: true;
  checkObjectValues?: false;
  children: JSX.Element | RequiredParameter<TRenderFunction>;
}): JSX.Element;
export function Match<
  T extends StrictKeyValueObject,
  TRenderFunction extends (item: Accessor<Prettify<NonNullableValues<T>>>) => JSX.Element,
>(props: {
  when: T | undefined | null | false;
  keyed?: false;
  checkObjectValues: true;
  children: JSX.Element | RequiredParameter<TRenderFunction>;
}): JSX.Element;
export function Match<
  T extends StrictKeyValueObject,
  TRenderFunction extends (item: Prettify<NonNullableValues<T>>) => JSX.Element,
>(props: {
  when: T | undefined | null | false;
  keyed: true;
  checkObjectValues: true;
  children: JSX.Element | RequiredParameter<TRenderFunction>;
}): JSX.Element;
export function Match<T>(props: MatchProps<T>) {
  return props as unknown as JSX.Element;
}
