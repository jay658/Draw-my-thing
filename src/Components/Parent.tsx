import Child from "./Child"
import type { ReactElement } from "react";

const Parent = (): ReactElement => {

  return (
    <div>
      <p aria-label="test">Parent text</p>
      <Child/>
    </div>
  );
};

export default Parent