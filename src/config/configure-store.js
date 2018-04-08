import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {routerMiddleware} from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import {createLogger} from 'redux-logger';
import rootReducer from '../redux';

export const history = createHistory();

const enhancers = [];
const middleware = [
    thunk,
    routerMiddleware(history)
];

// Logger
const logger = createLogger({
    level: 'info',
    collapsed: true
});

if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.devToolsExtension;
    if (typeof devToolsExtension === 'function') {
        enhancers.push(devToolsExtension());
    }
    middleware.push(logger);
}

const createStoreWithMiddleware = compose(
    applyMiddleware(...middleware)(createStore)
);

export function configure(initialState) {
    const configStore = createStoreWithMiddleware(
        rootReducer,
        initialState
    );

    if (module.hot) {
        module.hot.accept(function _() {
            configStore.replaceReducer(rootReducer);
        });
    }

    return configStore;
}
