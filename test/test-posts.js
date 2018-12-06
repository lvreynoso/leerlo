// mocha chai testing

// dependencies & setup
import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../source/server.js'
import database from '../source/database/database.js'
import Post from '../source/models/post.js'

// should style assertions
const should = chai.should()
chai.use(chaiHttp);

const agent = chai.request.agent(server)

describe('posts', function() {

    var numberOfPosts = 0

    // check how many posts there are
    before(async function() {
        const posts = await Post.find().catch(err => console.log(err))
        if (posts.length != null) {
            numberOfPosts = posts.length;
        }
        posts.length.should.be.finite;

        // mocha complains 'Error: Server is not listening' when the following
        // code is run as part of the full test suite, but not when run
        // by itself
        const testUser = {
            username: 'testone',
            password: 'password'
        }
        const res = await agent.post(`/login`).send(testUser)
        res.should.have.status(200)
    })

    after(async function() {
        const query = {
            title: `test post title`
        }
        const result = await Post.findOneAndDelete(query).catch(err => console.log(err))
        // result.should.have.property('title', `test post title`);

        agent.close();
    })

    // test post creation
    it(`Should create a new post`, async function() {
        const testPost = {
            subleerlo: `test`,
            title: `test post title`,
            url: `https://www.google.com/`,
            summary: `post summary`
        }
        const res = await agent.post(`/posts`).send(testPost)
            .catch(err => { return err })
        const testPostQuery = await Post.find().catch(err => { return err })
        testPostQuery.length.should.be.equal(numberOfPosts + 1)
        res.should.have.status(200);
    });

})
