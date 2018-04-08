import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { YMaps, Map, Placemark } from 'react-yandex-maps';

class App extends Component {
    state = {
        response: ''
    };
    componentDidMount() {
        this.callApi()
          .then(res => this.setState({ response: res.express }))
          .catch(err => console.log(err));
      }
    callApi = async () => {
        const response = await fetch('/api/xlsx');
        console.log(response);
        const body = await response.json();
        if (response.status !== 200) {
            throw Error(body.message);
        }
        console.log(body);
        return body;
    };
    render() {
        const mapState = { center: [55.76, 37.64], zoom: 10 };
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <YMaps>
                    <Map state={mapState}>
                        <Placemark
                        geometry={{
                            coordinates: [55.751574, 37.573856]
                        }}
                        properties={{
                            hintContent: 'Собственный значок метки',
                            balloonContent: 'Это красивая метка'
                        }}
                        options={{
                            iconLayout: 'default#image',
                            iconImageHref: 'images/myIcon.gif',
                            iconImageSize: [30, 42],
                            iconImageOffset: [-3, -42]
                        }}
                        />
                    </Map>
                </YMaps>
            </div>
        );
    }
}

export default App;
