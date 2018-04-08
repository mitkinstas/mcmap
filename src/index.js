import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App/App';
import './index.css';
import {ConnectedRouter} from 'react-router-redux';
import {Provider} from 'react-redux';
import {configure, history} from './config/configure-store';
import registerServiceWorker from './registerServiceWorker';

const store = configure();
const renderApp = App => {
    return ReactDOM.render(
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <App/>
            </ConnectedRouter>
        </Provider>,
        document.getElementById('root')
    );
};

renderApp(App);

if (module.hot) {
    module.hot.accept('./containers/App/App', () => {
        const NextApp = require('./containers/App/App').default;
        renderApp(NextApp);
    });
    window.store = store;
}

registerServiceWorker();
