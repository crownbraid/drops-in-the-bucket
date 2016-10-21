exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production' ?
                            'mongodb://userone:genericpass@ds011860.mlab.com:11860/drops-in-the-bucket' :
                            'mongodb://localhost/room-control-dev');
exports.PORT = process.env.PORT || 8080;