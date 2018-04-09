const express = require('express');
const MultiGeocoder = require('multi-geocoder');
const geocoder = new MultiGeocoder({
    coordorder: 'latlong',
    lang: 'ru-RU'
});
const fs = require('fs');
const xlsx = require('node-xlsx').default;
const app = express();
const port = process.env.PORT || 5000;
const workSheetsFromBuffer = xlsx.parse(fs.readFileSync(`${__dirname}/data.xlsx`));

const filteredAddresses = data => {
    if (!data) {
        return;
    }
    const list = data[1].data;
    return list.filter(item => {
        return item.length > 1 && item[3] === 'прямой' && item[1] !== 'См. на сайте' && (!item[1].includes('Адрес'));
    });
};

const addressFormat = address => {
    const clearedList = address.replace(/\(.+\)/, '').replace(/тел\..+/, '');
    const splittedAddress = clearedList.split(';');
    if (splittedAddress.length > 1) {
        const city = splittedAddress[0].split(',')[0];
        const addressList = splittedAddress.map((item, index) => {
            if (index > 0) {
                item = `${city} ${item}`;
            }
            return item;
        });
        return addressList;
    }
    return clearedList;
};

const getAddresses = data => {
    let dataList = data.map(item => {
        return addressFormat(item[1]);
    });
    return dataList.reduce((sum, current) => sum.concat(current), []);
};

const filteredData = filteredAddresses(workSheetsFromBuffer);
const preparedData = getAddresses(filteredData);

const composeData = (addresses, organisations) => {
    return addresses.reduce((sum, current, index) => {
        sum.push({
            coordinates: current.geometry.coordinates,
            name: `Адрес: ${current.properties.name}`
        });
        return sum;
    }, []);
};

const geoCode = async data => {
    return geocoder.geocode(data);
};

app.get('/api/xlsx', (req, res) => {
    const query = geoCode(preparedData);
    query.then(response => {
        res.send({express: composeData(response.result.features, filteredData)});
    });
});
app.listen(port, () => console.log(`Listening on port ${port}`));
