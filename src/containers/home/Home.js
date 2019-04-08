import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { YMaps, Map, Placemark } from 'react-yandex-maps';

import { organizationsActions } from '../../redux/example';
import './Home.css';

class Home extends React.Component {
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
        const body = await response.json();
        if (response.status !== 200) {
            throw Error(body.message);
        }
        return body;
    };

    render() {
        const mapState = {
            center: [56.840079, 60.610261],
            zoom: 12,
            controls: ['zoomControl', 'fullscreenControl', 'searchControl']
        };
        return (
            <div className="Home">
                <YMaps>
                    <Map state={mapState} width="100%" height="100%">
                        {this.renderOrgs()}
                    </Map>
                </YMaps>
            </div>
        );
    }

    renderOrgs = () => {
        if (!this.state.response) {
            return null;
        }
        return this.state.response.map(org => {
            return (
                <Placemark
                    geometry={{
                        coordinates: org.coordinates
                    }}
                    properties={{
                        hintContent: org.name,
                        balloonContent: org.name
                    }}
                    options={{
                        preset: 'islands#glyphIcon',
                        iconGlyph: 'home',
                        iconGlyphColor: 'blue'
                    }}
                />
            );
        });
    };
}

const mapStateToProps = state => ({
    orgList: state.orgList
});

const mapDispatchToProps = dispatch => ({
    organizationsActions: bindActionCreators(organizationsActions, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
