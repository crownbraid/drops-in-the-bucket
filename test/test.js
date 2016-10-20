var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Basic Server', function() {
    it('should load a root page when hitting the root url', function(done) {
        chai.request(app)
            .get('/index.html')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.html;
                done();
            });
    });
});