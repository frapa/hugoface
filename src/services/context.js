import React from "react";

import { isDirty } from "./git";

export async function initialContext() {
  return {
    dirty: await isDirty(),
  };
}

export const AppContext = React.createContext({});
