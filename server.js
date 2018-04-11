const express = require('express');
const MultiGeocoder = require('multi-geocoder');
const geocoder = new MultiGeocoder({
    coordorder: 'latlong',
    lang: 'ru-RU'
});
const provider = geocoder.getProvider();
const fs = require('fs');
const xlsx = require('node-xlsx').default;
const app = express();
const port = process.env.PORT || 5000;
const workSheetsFromBuffer = xlsx.parse(fs.readFileSync(`${__dirname}/data.xlsx`));

app.set('port', port);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

const filteredAddresses = data => {
    if (!data) {
        return;
    }
    const list = data[1].data;
    return list.filter(item => {
        return item.length > 1 && item[3] === 'прямой' && item[1] !== 'См. на сайте' && (!item[1].includes('Адрес'));
    });
};

const addressFormat = orgData => {
    const name = orgData[0];
    const address = orgData[1];
    const clearedList = address.replace(/\(.+\)/, '').replace(/тел\..+/, '');
    const splittedAddress = clearedList.split(';');
    if (splittedAddress.length > 1) {
        const city = splittedAddress[0].split(',')[0];
        const addressList = splittedAddress.map((item, index) => {
            if (index > 0) {
                item = `${city} ${item}`;
            }
            return {address: item, name: name};
        });
        return addressList;
    }
    return {address: clearedList, name: name};
};

const getAddresses = data => {
    let dataList = data.map(item => {
        return addressFormat(item);
    });
    return dataList.reduce((sum, current) => sum.concat(current), []);
};

const filteredData = filteredAddresses(workSheetsFromBuffer);
const preparedData = getAddresses(filteredData);

// fs.writeFile('./data.json', JSON.stringify(preparedData, null, 4), err => {
//     if (err) {
//         console.error(err);
//         return;
//     };
//     console.log('File has been created');
// });

const composeData = (addresses, organisations) => {
    return addresses.reduce((sum, current, index) => {
        sum.push({
            coordinates: current.geometry.coordinates,
            name: `Название: ${organisations[index].name}`
        });
        return sum;
    }, []);
};

const geoCode = data => {
    return geocoder.geocode(data);
};

provider.getText = function (point) { 
    const address = point.address;  
    return address;
};

app.get('/api/xlsx', (req, res) => {
    const query = geoCode(preparedData);
    query.then(response => {
        res.send({express: composeData(response.result.features, preparedData)});
    });
});
app.listen(port, () => console.log(`Listening on port ${port}`));
