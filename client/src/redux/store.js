import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";


import { initialState } from "./initialState";
import adsReducer from "./postsRedux";
import usersReducer from "./userRedux";

const subreducer = {
  ads: adsReducer,
  user: usersReducer
};

const reducer = combineReducers(subreducer);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  initialState,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;