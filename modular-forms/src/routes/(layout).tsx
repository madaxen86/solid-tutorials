import { createAsync } from "@solidjs/router";
import { ParentComponent } from "solid-js";
import { getTodos } from "~/server";
const Layout: ParentComponent = (props) => {
  createAsync(() => getTodos());
  return <>{props.children}</>;
};
export default Layout;
