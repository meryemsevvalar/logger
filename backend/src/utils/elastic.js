const { Client: Client7 } = require('es7');

// Çevre değişkenlerinden Elasticsearch yapılandırma bilgilerini al
const URI = process.env.ELASTIC_URI;
const USERNAME = process.env.ELASTIC_USER;
const PASSWORD = process.env.ELASTIC_PASS;

let elasticClient = null;

try {
    elasticClient = new Client7({
        node: URI,
        requestTimeout: 10000,
        auth: {
            username: USERNAME,
            password: PASSWORD
        },
    });
} catch(err) {
    console.log('Cannot connect to elastic', err);
}

const connectToElastic = async () => {
    if (!elasticClient) {
        console.log('Elasticsearch client is not initialized.');
        return null;
    }

    return elasticClient;
};

module.exports = { connectToElastic };

