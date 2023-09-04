// store/reduxStore.js
import { createStore } from "redux";

// Define an action
const CHANGE_ROUTE = "CHANGE_ROUTE";
export function changeRoute(route) {
  console.log("changeRoute", route);
  return { type: CHANGE_ROUTE, route };
}

const initialState = {
  currentPage: "/",
};

// Define a reducer
function appReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_ROUTE:
      return {
        ...state,
        currentPage: action.route,
      };
    default:
      return state;
  }
}

// Create a Redux store
export const store = createStore(appReducer);
