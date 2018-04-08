const express = require('express');
const fs = require('fs');
const xlsx = require('node-xlsx').default;
const app = express();
const port = process.env.PORT || 5000;
const workSheetsFromBuffer = xlsx.parse(fs.readFileSync(`${__dirname}/data.xlsx`))

app.get('/api/xlsx', (req, res) => {
	res.send({ express: workSheetsFromBuffer });
});
app.listen(port, () => console.log(`Listening on port ${port}`));