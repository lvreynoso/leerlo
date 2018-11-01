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

describe('posts', function() {

    var numberOfPosts = 0

    // check how many posts there are
    before(async function() {
        const posts = await Post.find().catch(err => console.log(err))
        if (posts.length != null) {
            numberOfPosts = posts.length;
        }
    })

    after(async function() {
        const query = {
            title: `test post title`
        }
        await Post.findOneAndDelete(query).catch(err => console.log(err))
    })

    // test post creation
    it(`Should create a new post`, async function() {
        const testPost = {
            title: `test post title`,
            url: `https://www.google.com/`,
            summary: `post summary`
        }
        const res = await chai.request(server).post(`/posts`).send(testPost)
            .catch(err => { return err })
        const testPostQuery = await Post.find().catch(err => { return err })
        testPostQuery.length.should.be.equal(numberOfPosts + 1)
        res.should.have.status(200);
    });

})
