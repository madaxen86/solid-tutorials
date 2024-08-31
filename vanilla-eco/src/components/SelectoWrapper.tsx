import { onCleanup, onMount, ParentComponent } from "solid-js";
import Selecto from "selecto";
const SelectoWrapper: ParentComponent = (props) => {
  let ref!: HTMLUListElement;

  onMount(() => {
    const selecto = new Selecto({
      // The container to add a selection element
      container: ref,
      // Selecto's root container (No transformed container. (default: null)
      rootContainer: null,

      // Targets to select. You can register a queryselector or an Element.
      selectableTargets: ["li"],
      // Whether to select by click (default: true)
      selectByClick: true,
      // Whether to select from the target inside (default: true)
      selectFromInside: true,
      // After the select, whether to select the next target with the selected target (deselected if the target is selected again).
      continueSelect: false,
      // Determines which key to continue selecting the next target via keydown and keyup.
      toggleContinueSelect: "shift",
      // The container for keydown and keyup events
      keyContainer: window,
      // The rate at which the target overlaps the drag area to be selected. (default: 100)
      hitRate: 0,
    });

    selecto.on("select", (e) => {
      e.added.forEach((el) => {
        el.setAttribute("data-selected", "true");
      });
      e.removed.forEach((el) => {
        el.removeAttribute("data-selected");
      });
    });
    onCleanup(() => selecto.destroy());
  });
  return (
    <ul ref={ref} class="flex flex-wrap justify-center gap-5 p-8">
      {props.children}
    </ul>
  );
};
export default SelectoWrapper;
