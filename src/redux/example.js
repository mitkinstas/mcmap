/**
 * Actions
 */

const Organizations = {
    'GET_LIST': 'GET_LIST'
};

export const organizationsActions = {
    getList: () => {
        return dispatch => {
            dispatch({
                type: Organizations.GET_LIST
            });
        };
    }
};

/**
 * Reducers
 */

const defaultOrgState = {
    orgList: []
};

const OrgReducer = (state = defaultOrgState, action) => {
    switch (action.type) {
        case Organizations.GET_LIST:
            return {
                ...state,
                ...action
            };
        default:
            return state;
    }
};

export default OrgReducer;
