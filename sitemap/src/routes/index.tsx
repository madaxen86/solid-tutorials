import { A } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import Counter from "~/components/Counter";
import { Show as ShowNarrow } from "~/components/Narrow";

export default function Home() {
  return (
    <main class="text-center mx-auto p-4">
      <Test
        data={{
          divider: 1,
          divisor: 5,
        }}
      />
    </main>
  );
}

type Data = {
  data?: {
    divisor?: number;
    divider?: number;
  };
};

function Test(props: Data) {
  const [isOpen, setIsOpen] = createSignal(true);
  const [store, setStore] = createStore({
    data: { ...props.data, isOpen: false },
  });
  const map = new Map();
  map.set(1, 2);
  return (
    <>
      <h4>checkObjectValues - accessor </h4>
      <ShowNarrow
        fallback="fallback"
        when={{ divisor: props.data?.divisor, divider: props.data?.divider, isOpen: isOpen() }}
        checkObjectValues
      >
        {(n) => <Comp {...n()} />}
      </ShowNarrow>

      <h4>alltruthy - keyed</h4>
      <ShowNarrow
        fallback="fallback"
        when={{ divisor: props.data?.divisor, divider: props.data?.divider, isOpen: isOpen() }}
        keyed
        checkObjectValues
      >
        {(n) => <Comp {...n} />}
      </ShowNarrow>
      {/* 
Error cases: 
*/}
      <h4>Regular - accessor</h4>
      <ShowNarrow
        fallback="fallback"
        when={{ divisor: props.data?.divisor, divider: props.data?.divider, isOpen: isOpen() }}
      >
        {(n) => <Comp {...n()} />}
      </ShowNarrow>

      <h4>Regular - keyed</h4>
      <ShowNarrow
        fallback="fallback"
        keyed
        when={{ divisor: props.data?.divisor, divider: props.data?.divider, isOpen: isOpen() }}
      >
        {/* @ts-expect-error */}
        {(n) => <Comp {...n} />}
      </ShowNarrow>

      <h4>Array to checkObjectValues</h4>
      <ShowNarrow
        fallback="fallback"
        checkObjectValues
        when={[1, 4]}
        keyed
      >
        {(n) => <Comp {...n} />}
      </ShowNarrow>
    </>
  );
}

function Comp(props: { divisor: number; divider: number }) {
  return (
    <p>
      {props.divider || 1} / {props.divisor || 1}
    </p>
  );
}
const map = new Map();

const t = Object.values([0, 3]).every((value) => !!value);
