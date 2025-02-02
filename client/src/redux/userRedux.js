const createActionName = (actionName) => `auth/user/${actionName}`;
const LOG_IN = createActionName('LOG_IN');
const LOG_OUT = createActionName('LOG_OUT');

export const logIn = payload => ({
    type: LOG_IN,
    payload
})

export const logOut = () => ({
    type: LOG_OUT,
})

const usersReducer = (statePart = {}, action) => {
    switch (action.type) {
        case LOG_IN:
            return action.payload;
        case LOG_OUT:
            return {};
        default:
            return statePart;
    }
};

export default usersReducer;