import React, { Component } from 'react';
import {Switch, Route} from 'react-router-dom';
import {withRouter} from 'react-router';
import Home from '../home';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Switch>
                    <Route exact path="/" component={Home}/>
                </Switch>
            </div>
        );
    }
}

export default withRouter(App);
