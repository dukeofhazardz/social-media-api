## Social Media API Documentation

This is a comprehensive README file for the Social Media API project.

### Project Description

This project is a Social Media API that facilitates user interactions and data management. It allows users to perform actions like signup, login, create posts, like and unlike posts, comment on posts, follow other users, view profiles, and more.

### Technologies Used

The following technologies are used in this project:

* **Backend:**
    * **Programming Language:** TypeScript
    * **Web Framework:** Express.js
    * **Database:** MongoDB with Mongoose ODM
    * **Caching:** Redis
    * **Authentication:** JSON Web Tokens (JWT)
* **Frontend:**
    * **Templating Engine:** EJS
    * **CSS Framework:** Bootstrap

### Installation and Setup

1. **Clone the Repository:**

```bash
git clone https://gitlab.com/backend-engineer-assessment/social-media-api.git
```

2. **Install Dependencies:**

```bash
cd social-media-api
npm install
```

**Note:** Make sure you have `Node.js`, `npm`, `Redis`, `MongoDB` installed and running locally on your system before proceeding.

### Running the Application

1. **Compile TypeScript files:**
```bash
npm run build
```

2. **Start the Production Server:**

```bash
npm run start
```

This will start the Express server in production mode and listen for requests on localhost port 8000.

### API Routes

The API provides various routes for user interaction and data management. Here's a breakdown of the functionalities offered by each route:

**Authentication Routes:**

* `/login` (**POST**): Login a user and generate a JWT token for authentication.
* `/signup` (**POST**): Create a new user account.
* `/logout` (**POST**): Logout a user and invalidate their JWT token.

**Authorization Middleware:**

* `checkToken` (Middleware): Checks for the presence of a valid JWT token in the request header.
* `verifyToken` (Middleware): Verifies the validity of the JWT token and retrieves the user data associated with it.
* `handleTokenExpiration` (Middleware): Handles JWT token expiration and refreshes it if necessary.

**User Routes:**

* `/profile` (**GET**): Get the current user's profile information.
* `/user/:id` (**GET**): Get the profile information of a specific user.
* `/users` (**GET**): Get a list of all users on the platform.

**Post Routes:**

* `/feeds` (**GET**): Get a list of posts from users the current user follows.
* `/post/:id` (**GET**): Get the details of a specific post.
* `/posts` (**POST**): Create a new post.
* `/like` (**POST**): Like a post.
* `/unlike` (**POST**): Unlike a post.
* `/comment` (**POST**): Add a comment to a post.

**Following Routes:**

* `/follow` (**POST**): Follow another user.
* `/unfollow` (**POST**): Unfollow a user.
* `/followers/:id` (**GET**): Get a list of users who follow a specific user.
* `/following/:id` (**GET**): Get a list of users a specific user is following.

**Other Routes:**

* `/notifications` (**GET**): Get the current user's notifications.
* `/settings` (**GET**): Get the current user's settings.
* `/settings` (**POST**): Update the current user's profile picture (with multer middleware for handling file uploads).

### Testing

The project uses Jest as a testing framework. To run the tests, execute the following command:

```bash
npm run test
```

### Built-in Scripts

The `package.json` file includes several scripts for development and production purposes:

* `test`: Runs the Jest tests.
* `build`: Compiles the TypeScript code into JavaScript using the TypeScript compiler (`tsc`).
* `start`: Starts the Node.js server in production mode.
* `dev`: Starts the Node.js server in development mode with Nodemon for automatic restarts on code changes.

### Author

Nnaemeka Daniel John