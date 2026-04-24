import { createDefaultStore } from "../defaultState";
import { reduceConnectionActions } from "./connectionReducer";
import { reduceForumActions } from "./forumReducer";
import { reduceNewsletterActions } from "./newsletterReducer";
import { reducePeerActions } from "./peerReducer";

const DOMAIN_REDUCERS = [
  reducePeerActions,
  reduceForumActions,
  reduceConnectionActions,
  reduceNewsletterActions,
];

export const soarReducer = (state, action) => {
  if (action.type === "RESET_DEVICE_DATA") {
    return createDefaultStore();
  }

  for (const reducer of DOMAIN_REDUCERS) {
    const nextState = reducer(state, action);
    if (nextState !== state) {
      return nextState;
    }
  }

  return state;
};
