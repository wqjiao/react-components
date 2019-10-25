import { combineReducers } from 'redux';

import homeReducer from '../pages/redux';

const reducers = {
  	home: homeReducer,
};

const rootReducer = combineReducers(reducers);

export default rootReducer;
