// mocha chai testing

// dependencies & setup
import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../source/server.js'
const should = chai.should()

chai.use(chaiHttp);

describe('site', function() {

    it('Should have a home page', async function() {
        const res = await chai.request(server).get('/').catch(err => { return err })
        res.status.should.be.equal(200);
        res.should.be.html;
    });
})
