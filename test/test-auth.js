// test authentication

// dependencies & setup
import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../source/server.js'

// models
import User from '../source/models/user.js'

// should style assertions
const should = chai.should()
chai.use(chaiHttp);

const agent = chai.request.agent(server)

describe('Authentication', function() {

    after(function() {
        agent.close()
    })

    it('Should not be able to login unless registered', async function() {
        const res = await agent.post(`/login`, {
            email: 'wrong@wrong.com',
            password: 'nope'
        })
        res.status.should.be.equal(401)
    })

    it('Should be able to signup for an account', async function() {
        const testUser = {
            username: 'testone',
            password: 'password'
        }
        const res = await agent.post(`/sign-up`).send(testUser)
        res.should.have.status(200)
        //res.should.have.cookie('nToken')
    })

    it('Should be able to logout of an account', async function() {
        const res = await agent.get('/logout')
        res.should.have.status(200)
        res.should.not.have.cookie('nToken')
    })

    it('Should be able to login to an account', async function() {
        const testUser = {
            username: 'testone',
            password: 'password'
        }
        const res = await agent.post(`/login`).send(testUser)
        res.should.have.status(200)
        //res.should.have.cookie(`nToken`)
    })

})
