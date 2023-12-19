import { configureStore } from "@reduxjs/toolkit";

// Define an action
const CHANGE_ROUTE = "CHANGE_ROUTE";
export function changeRoute(route) {
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

// Create a Redux store using configureStore
export const store = configureStore({
  reducer: appReducer,
});
