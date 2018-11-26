// posts-script.js

// my code to enable ajax downvoting and upvoting

window.onload = function() {
    for (let i = 0; i < document.getElementsByClassName('vote-up').length; i++) {
        document.getElementsByClassName('vote-up')[i].addEventListener("submit", upvoter)
    }
    for (let i = 0; i < document.getElementsByClassName('vote-down').length; i++) {
        document.getElementsByClassName('vote-down')[i].addEventListener("submit", downvoter)
    }
}

async function upvoter(event) {
    event.preventDefault()
    const postId = event.target.getAttribute('data-id')
    const response = await axios.put(`/posts/${postId}/vote-up`)
    console.log(response)
}

async function downvoter(event) {
    event.preventDefault()
    const postId = event.target.getAttribute('data-id')
    const response = await axios.put(`/posts/${postId}/vote-down`)
    console.log(response)
}
