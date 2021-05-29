// const { nextTick } = require("process")

const BASE_URL = "https://strangers-things.herokuapp.com/api/2102-CPU-RM-WEB-PT"

const fetchPosts = async () => {
    try {
        const response = await fetch(`${BASE_URL}/posts`)
        const {data} = await response.json()
        const {posts} = data
        
        console.log(data)

        $(".register").css("display", "none")
        return renderPosts(posts)
    } catch (error) {
        console.error(error)
    }
}

const renderPosts = (posts) => {
    posts.forEach((post) => {
        const postElement = createPostHtml(post)
        $("#posts").append(postElement)
        })
}

function createPostHtml(post) {
    const {author, title, description, price} = post

    return $(`
    <div class="card" style="width: 18rem;">
    <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">${description}</p>
    </div>
        <ul class="list-group list-group-flush">
            <li class="list-group-item"><b>Seller:</b> ${author.username}</li>
            <li class="list-group-item"><b>Price:</b> ${price}</li>
        </ul>
    <div class="card-body" id="bottom-card">
    <a href="#" id="edit-button" class="card-link">Edit</a>
    <a href="#" id="delete-button" class="card-link">Delete</a>
    <a href="#" id="message-button" class="card-link">Message Seller</a>

    </div>
    </div>
    `).data("post", post)
}

const registerUser = async (usernameValue, passwordValue) => {
    const url = `${BASE_URL}/users/register`;
    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                user: {
                    username: usernameValue,
                    password: passwordValue
                }
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const { data: {token} } = await response.json();
        localStorage.setItem("token", JSON.stringify(token))
        hideRegistration()

    } catch(error) {
        console.error(error);
    }
};

const loginUser = async (usernameValue, passwordValue) => {

    const url = `${BASE_URL}/users/login`;
    try {
        const response = await fetch(url, { 
            method: "POST",
            body: JSON.stringify({ 
                username: usernameValue,
                password: passwordValue
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const { data: {token} } = await response.json();
        localStorage.setItem("token", JSON.stringify(token))
        hideLogin();
        hideRegistration();
    } catch(error) {
        console.error(error);
    }
}

const hideRegistration = () => {
    const token = localStorage.getItem("token");
    if (token){
        $(".register").css("display", "none")
    } else {
        console.log("there is nothing to hide")
    }
}

const hideLogin = () => {
    const token = localStorage.getItem("token");
    if (token){
        $("#login-button").css("display", "none")
    } else {
        console.log("there is nothing to hide")
    }
}

const postBlogEntry = async (requestBody) => {
    const token = JSON.parse(localStorage.getItem('token'))
    try {
        const request = await fetch(`${BASE_URL}/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
    
            },
            body: JSON.stringify(requestBody),
        })
    } catch(e) {
        console.error(e)
    }
}

$("#blog-post").on("submit", (e)  => {
    e.preventDefault()

    const blogTitle = $("#blog-title").val()
    const blogDescription = $("#blog-description").val()
    const blogPrice = $("#blog-price").val()
    const blogAuthor = $("#blog-author").val()

    const requestBody = {
        post: 
        {
            title: blogTitle,
            description: blogDescription,
            price: blogPrice,
            author: blogAuthor
        }
    }

    const blogEntry = postBlogEntry(requestBody)
    $("#posts").prepend(blogEntry)
    // console.log(blogEntry)
    $("form").trigger("reset")
    
})

const editBlogEntry = async (requestBody, postId) => {
	try {
        const token = JSON.parse(localStorage.getItem("token"))
		const request = await fetch(`${BASE_URL}/posts/${postId}`, {
			method: "PATCH", 
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${ token }`
			},
			body: JSON.stringify(requestBody),
		})
	} catch(e) {
		console.error(e)
	}
}

// This function is only going to work if we have HTML in your HTML
// file that will show what your edit modal should look like

// This click handler will be to actually toggle open the edit modal
$('#posts').on('click', '#edit-button', function (){

    $('#exampleModal').modal('show')
    $('#exampleModal .modal-body').empty()
    $('#exampleModal .modal-body').append(`
    <form id="blog-post">
    <div class="form-group">
        <label class="mb-2" for="blog-title">Title</label>
        <input
            class="form-control"
            id="blog-title"
            type="text"
            placeholder=""
            required
        />
    </div>
    <div class="form-group">
        <label for="blog-description" class="mb-2">Item Description</label>
        <textarea
            class="form-control"
            name="blog-description"
            id="blog-description"
            cols="30"
            rows="10"
            placeholder="Blog Description"
            required
        >
        </textarea>
    </div>
    <div class="form-group">
        <label for="blog-price" class="mb-2">Price</label>
        <input
            type="text"
            class="form-control"
            id="blog-price"
            placeholder=""
            required
        />
</div>
</form>
    `)
/* <div class="form-group">
    <label for="blog-author" class="mb-2">Author</label>
    <input
        type="text"
        class="form-control"
        id="blog-author"
        placeholder=""
        required
    />
</div> */

})

// Another click handler which will work on the edit modal's submit button 
$('#submit-edit-btn').on('submit', async (event) => {
    event.preventDefault()
    console.log('Edit Submit Successful')
    // Here make a variable that holds the info from the nearest post
    const blogTitle = $("#blog-title").val()
    const blogDescription = $("#blog-description").val()
    const blogPrice = $("#blog-price").val()
    
    const requestBody = {
        post: 
        {
            title: blogTitle,
            description: blogDescription,
            price: blogPrice,
        }
    }

    try {
        // Make your actual request using your edit post function - be sure to use await
        
        const result = await editBlogEntry(requestBody, card.post._id)

        
    } catch(e) {
        console.error(e)
    }
})

const deleteBlogEntry = async (postId) => {
    const token = JSON.parse(localStorage.getItem('token'))

	try {
		const request = await fetch(`${BASE_URL}/posts/${postId}`, {
			method: "DELETE", 
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			}
		})
	} catch(e) {
		alert(e)
	}
}

$(".register form").on('submit', (event) => {
    event.preventDefault();
    const username = $("#registerInputPassword").val();
    const password = $("#registerInputPassword").val();
    registerUser(username, password)
});

$(".login form").on("submit", (event) => {
    event.preventDefault();
    const username = $("#loginInputUsername").val();
    const password = $("#loginInputPassword").val();
    loginUser(username, password);
});

$("#registerButton").on("click", function() {
    console.log("test")
    $(".register").css("display", "block")

})

$("#login-button").on("click", function() {
    console.log('test')
    $(".modal-content").html(`
    <form class="loginSubmitForm">
        <div class="form-group">
            <h3>Login</h3>
            <label for="loginInputUsername">Username</label>
            <input
                type="text"
                class="form-control"
                id="loginInputUsername"
                aria-describedby="usernameHelp"
                placeholder="Enter username"
            />
        </div>
        <div class="form-group">
            <label for="loginInputPassword">Password</label>
            <input
                type="password"
                class="form-control"
                id="loginInputPassword"
                placeholder="Password"
            />
        </div>
        <button type="submit" class="btn btn-primary" id="loginSubmitButton">Submit</button>
    </form>
    `)
    $("#exampleModal").modal("show")
    console.error(error)
});

$("#loginSubmitButton").on("click", function() {
    console.log("hello")
    // event.preventDefault()
    const username = $("#loginInputUsername").val();
    const password = $("#loginInputPassword").val();
    loginUser(username, password);
    $(this).closest(".modal").modal("hide")
})

$('#posts').on('click', '#delete-button', function () {
    let deletedCard = $(this).closest('.card')
    let postData = $(this).closest('.card').data('post')
    deleteBlogEntry(postData._id).then(function() {
        deletedCard.remove()
    })
});

$('#logout-button').on('click', function () {
    localStorage.clear()
});

(async () => {
    hideRegistration();
    hideLogin();
    const posts = await fetchPosts();
})()