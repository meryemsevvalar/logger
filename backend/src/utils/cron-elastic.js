const {connectToElastic} = require('./elastic')

const cron = require('node-cron');

cron.schedule('0 * * * *', async () => {
  try {
    const elasticClient = await connectToElastic(); 
    if (!elasticClient) {
      console.error('Elasticsearch client is not initialized.');
      return;
    }

    const cutoffDate = moment().subtract(1, 'hours');

    await elasticClient.deleteByQuery({
      index: 'muhakemat_logs',
      body: {
        query: {
          range: {
            date: {
              lt: cutoffDate.toISOString() 
            }
          }
        }
      }
    });

    console.log('Logs written in the last hour have been successfully deleted.');
  } catch (error) {
    console.error('Error deleting logs written in the last hour:', error);
  }
});

