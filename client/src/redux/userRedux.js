import { API_URL } from "../config";

const createActionName = (actionName) => `auth/user/${actionName}`;
const LOG_IN = createActionName("LOG_IN");
const LOG_OUT = createActionName("LOG_OUT");

export const logIn = (payload) => ({
  type: LOG_IN,
  payload,
});

export const logOut = () => ({
  type: LOG_OUT,
});

export const checkUser = () => async (dispatch) => {
  try {
    const res = await fetch(`${API_URL}auth/user`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    if (res.status === 200) {
      dispatch(logIn(data.user));
    } else {
      dispatch(logOut());
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    dispatch(logOut());
    alert("Błąd sprawdzania sesji!");
  }
};

const usersReducer = (statePart = {}, action) => {
  switch (action.type) {
    case LOG_IN:
      return action.payload;
    case LOG_OUT:
      return null;
    default:
      return statePart;
  }
};

export default usersReducer;
