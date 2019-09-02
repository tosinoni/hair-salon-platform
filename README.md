# hair-salon-platform

The platform uses [ReactJS](http://reactjs.org) for client side and [Express](http://expressjs.com) for server side.

##	Steps for setting up development environment
Install [Git](http://git-scm.com) and [node.js](http://nodejs.org).

##	Setting up the development environment
Clone the project and create a .env file and add it to the root of the project.
Create a mongodb database on [mlab](http://mlab.com)

      ADD mongodb link e.g DB_LINK=mongodb://<username>:<password>@ds021010.mlab.com:21010/<db-name>
      Add JWT_SECRET env variable on a new line -> JWT_SECRET=<anything you want> 



DB_LINK=mongodb://teeboy:Admin123@ds021010.mlab.com:21010/olalere-db
DB_HOST=localhost
JWT_SECRET=TEEBOY_NONI

## Running the platform

In the main directory, execute:

      npm install
      npm run dev

Your server will run at [http://localhost:3000](http://localhost:3000).
