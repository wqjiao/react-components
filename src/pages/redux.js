// Actions
const UPDATE_INFO = 'UPDATE_INFO';

let initState = {
    name: '大地'
}

// Reducer
export default function reducer(state = initState, action = {}) {
    switch (action.type) {
        case UPDATE_INFO:
            return { ...state, ...action.data }
        default:
            return state;
    }
}

// Action Creators
export function updateHomeInfo(data) {
    return {
        type: UPDATE_INFO,
        data
    };
}

export function resetHomeInfo() {
    return function (dispatch, getState) {
        dispatch(updateHomeInfo({
            name: 'Home'
        }))
    }
}
