import { createStore, applyMiddleware, compose } from 'redux';

import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from './reducers';

// 环境变量
// const ENV = (function(){
// 	if (window.env === 'local') {
// 		return 'dev';
// 	} else {
// 		return window.env;
// 	}
// })();

export default function configureStore(initialState) {

    let middleware;

    // 线上不需要打印state日志
    middleware = [thunk, createLogger]

    // if (ENV === 'production' || ENV === 'gray') {
    // 	middleware = [ thunk ]
    // } else {
    // 	middleware = [ thunk, createLogger() ]
    // }

    // redux的store对象
    const store = createStore(
        rootReducer, // 注册action的处理逻辑
        initialState,
        compose(
            applyMiddleware(...middleware)
        )
    );

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./reducers', () => {
            const nextRootReducer = require('./reducers').default
            store.replaceReducer(nextRootReducer);
        })
    }

    return store;
}
