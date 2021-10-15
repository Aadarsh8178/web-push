import produce from "immer";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { userSlice } from "./userSlice";

// Log every time state is changed
const log = (config) => (set, get, api) =>
  config(
    (args) => {
      console.log("  applying", args);
      set(args);
      console.log("  new state", get());
    },
    get,
    api
  );

// Turn the set method into an immer proxy
const immer = (config) => (set, get, api) =>
  config(
    (partial, replace) => {
      const nextState =
        typeof partial === "function" ? produce(partial) : partial;
      return set(nextState, replace);
    },
    get,
    api
  );

const useStore = create(
  log(
    immer(
      devtools((set, get) => ({
        ...userSlice(set, get),
      }))
    )
  )
);

export default useStore;
