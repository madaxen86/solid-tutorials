import {
  Component,
  createSignal,
  Switch as OSwitch,
  Match as OMatch,
  Show as OShow,
  ParentProps,
  createEffect,
  JSXElement,
} from "solid-js";
import { createStore, unwrap } from "solid-js/store";

import { Show, Switch, Match } from "~/Show";
const Test: Component = (props) => {
  const [state, setState] = createSignal("");
  const [signal, setSignal] = createSignal<boolean>();
  const [signal2, setSignal2] = createSignal<number>();
  const [store, setStore] = createStore({
    x: 0,
    y: 0,
    first: "john",
    last: "doe",
  });
  return (
    <>
      <button
        class="w-[200px] rounded-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 active:border-gray-400 px-[2rem] py-[1rem]"
        onClick={() => {
          setSignal((prev) => !prev);
        }}
      >
        Signal *{signal() ? "true" : "false"}*
      </button>
      <button
        class="w-[200px] rounded-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 active:border-gray-400 px-[2rem] py-[1rem]"
        onClick={() => {
          setState((prev) => prev + " i");
        }}
      >
        State *{state()}*
      </button>
      <button
        class="w-[200px] rounded-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 active:border-gray-400 px-[2rem] py-[1rem]"
        onClick={() => {
          setStore("x", (prev) => prev + 1);
        }}
      >
        store x *{store.x}*
      </button>
      <button
        class="w-[200px] rounded-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 active:border-gray-400 px-[2rem] py-[1rem]"
        onClick={() => {
          setStore("y", (prev) => prev + 1);
        }}
      >
        store y *{store.y}*
      </button>
      <Show
        when={{ signal: signal(), state: state() }}
        checkObjectValues
      >
        {(t) => (
          <div>
            <Comp
              slot={t().signal}
              name="signal"
            />
            <Comp
              slot={t().state}
              name="state"
            />
          </div>
        )}
      </Show>
      Show keyed:
      <Show
        when={{ signal: signal(), state: state() }}
        checkObjectValues
        keyed
      >
        {(t) => (
          <div>
            <Comp
              slot={t.signal}
              name="signal"
            />
            <Comp
              slot={t.state}
              name="state"
            />
          </div>
        )}
      </Show>
      <div>STORE</div>
      <Show
        when={{ ...store }}
        checkObjectValues
        keyed
      >
        {(s) => {
          return (
            <div>
              <Comp
                slot={s.x}
                name="storex"
              />
              <Comp
                slot={s.y}
                name="storey"
              />
            </div>
          );
        }}
      </Show>
      {/* <Show
        when={store}
        checkObjectValues
        keyed
      >
        {(s) => (
          <div>
            <Comp
              slot={s.x}
              name="storex"
            />
            <Comp
              slot={s.y}
              name="storey"
            />
          </div>
        )}
      </Show> */}
      Regular Show:
      {/* <Show when={signal() && state()}>{(t) => <div>{t() + "+++"}</div>}</Show> */}
      <OShow when={signal2() && signal()}>
        {(sig) => (
          <OShow when={state()}>
            {(st) => (
              <div>
                <Comp
                  slot={sig()}
                  name="keyed -signal"
                />
                <Comp
                  slot={st()}
                  name="keyed-state"
                />
              </div>
            )}
          </OShow>
        )}
      </OShow>
      {/* <Switch>
        <Match when={{ signal: signal(), state: state() }} checkObjectValues>
          {(t) => <div>{"signal: " + t().signal + "   state: " + t().state}</div>}
        </Match>
      </Switch>
      <OSwitch>
        <OMatch when={{ signal: signal(), state: state() }}>
          {(t) => <div>{"signal: " + t().signal + "   state: " + t().state}</div>}
        </OMatch>
      </OSwitch>  */}
    </>
  );
};
export default Test;

type Z = boolean;
type NotFalse<T> = T extends false ? never : T;

type A = NotFalse<Z>;

function Comp(props: { slot: JSXElement; name: string }) {
  createEffect(() => {
    const t = props; //subscribe
    console.log("update", t.name, t.slot);
  });
  return <p id={props.name}>{props.slot}</p>;
}
