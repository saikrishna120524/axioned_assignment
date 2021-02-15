/* Only this file has to initialize database.
All DB upgrades has to be done here only.
Documentation for reference http://mongoosejs.com/docs/connections.html
*/

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

class MongooseConnection {
    connect() {
        return new Promise((resolve, reject) => {
            let options = {
                useCreateIndex: true,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                retryWrites: true
            };
            mongoose.connect(process.env.MONGODB_URL, options, (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    };
}

exports = module.exports = new MongooseConnection();