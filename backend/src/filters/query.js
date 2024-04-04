const express = require('express');
const { connectToElastic } = require('../utils/elastic');
const moment = require('moment');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
       
        const { logSource, date, logType, logTypeName, logLevel, searchText } = req.query;

        const elasticClient = await connectToElastic();
        if (!elasticClient) {
            return res.status(500).send('Elasticsearch client is not initialized.');
        }
        let startDate, endDate;
        startDate = moment().startOf('day');
        endDate = moment().endOf('day');

        if (date) {

            switch (date) {
                case 'today':
                    startDate = moment().startOf('day');
                    endDate = moment().endOf('day');
                    break;
                case 'yesterday':
                    startDate = moment().subtract(1, 'days').startOf('day');
                    endDate = moment().subtract(1, 'days').endOf('day');
                    break;
                case 'last_week':
                    startDate = moment().subtract(1, 'weeks').startOf('week');
                    endDate = moment().subtract(1, 'weeks').endOf('week');
                    break;
                case 'last_month':
                    startDate = moment().subtract(1, 'months').startOf('month');
                    endDate = moment().subtract(1, 'months').endOf('month');
                    break;
                default:
                   
                    break;
            }
        }
       
        const rangeQuery = {
            range: {
                date: {
                    gte: startDate.toISOString(),
                    lte: endDate.toISOString()
                }
            }
        };

       
        const query = {
            index: 'muhakemat_logs',
            body: {
                query: {
                    bool: {
                        must: [
                            ...(logLevel ? [{ term: { logLevel } }] : []),
                            ...(logSource ? [{ term: { logSource } }] : []),
                            ...(logType ? [{ term: { logType } }] : []),
                            ...(logTypeName ? [{ term: { logTypeName } }] : []),
                            rangeQuery,
                            ...(searchText ? [{ match: { subject: searchText } }] : [])
                        ],
                    },
                },
               
            }
        }
        const { body } = await elasticClient.search(
            query
        );

        res.json(body);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

module.exports = router;
