import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import configureStore from './redux/store';

import Routes from './routes';

import './index.less';

let store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            {Routes}
        </HashRouter>
    </Provider>,
    document.getElementById('root')
);

serviceWorker.unregister();
