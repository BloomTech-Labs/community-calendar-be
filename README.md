![license](https://camo.githubusercontent.com/743d6ca437fec2ad80985c1208501b7c7b4b97ae/68747470733a2f2f696d672e736869656c64732e696f2f7061636b61676973742f6c2f646f637472696e652f6f726d2e737667)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Maintainability](https://api.codeclimate.com/v1/badges/a6369de9a1a1ed67dd83/maintainability)](https://codeclimate.com/github/Lambda-School-Labs/community-calendar-be/maintainability) 
[![Test Coverage](https://api.codeclimate.com/v1/badges/a6369de9a1a1ed67dd83/test_coverage)](https://codeclimate.com/github/Lambda-School-Labs/community-calendar-be/test_coverage)


Community Calendar Back End
We create incredible neighborhoods and community spaces through meaningful shared events. You can find the deployed project at Community Calendar.

- [Contributors](README.md#contributors)
- [Project Overview](README.md#project-overview)
- [Build and Installation](README.md#build-and-installation)
- [Endpoints](README.md#endpoints)
- [Available Scripts](README.md#available-scripts)
- [Testing](README.md)
- [Contributing](README.md#testing)

# Contributors
| [Louis Gelinas](https://github.com/gelinas) | [Daniel Prue](https://github.com/fireblastdaniel) | [Josue Rodriguez](https://github.com/JosueRodriguez-webdev) | [Kennith Howe](https://github.com/Draxxus702) | [Minakshi Verma](https://github.com/Minakshi-Verma) | [Rachel Carter](https://github.com/rjcrter11) |

# Project Overview
---
[Product Vision](https://www.notion.so/Community-Calendar-25c4624fa8fe46e49361d73215459050) on Notion.

[Planned Releases](https://www.notion.so/06de41bdd6124a459140e0b943b648a1?v=a0986751fe6e4fcdaa6782c5f827871d) on Notion.

The Community Calendar Backend repository contains code for four services in our stack.

1. An Apollo GraphQL service in the root directory that conducts business logic on GraphQL queries with data collected from the database and authentication services.

2. A Prisma Database ORM service defined in the /prisma/ directory. The prisma-client is ready for deployment on any Prisma implementation, including free deployment on Heroku through Prisma Cloud.

3. An Okta authentication application hosted on [Okta](https://www.okta.com/).

4. An [AWS](https://aws.amazon.com/) deployment service 
 

## Key Features
- Serve a list of community events 
- Allow users to create accounts with Google, Facebook, or an email address 
- Geocode event addresses into lattitude and longitude for location based searching 
- Allow community members to create and update their own events 
- Allow community members to RSVP to events 
- Integrate user profiles for creating, saving, and managing events 
- Integrate external event APIs from Ticketmaster, Facebook, and EventBrite 

## Backend Framework
We chose an Apollo GraphQL server over a RESTful API for two reasons:

1. Allow web and mobile clients to request the exact event details they have space to render. This prevents overfetching and increases performance on mobile.

2. Allow the Community Calendar API to be seamlessly expanded to include integration of event data from external APIs in future releases

## Client repositories
This back end API is consumed by two clients:

1. Web application at React [Front End Repository](https://github.com/Lambda-School-Labs/community-calendar-fe).
2. iOS application at [iOS Application Repository](https://github.com/Lambda-School-Labs/community-calendar-ios).

# Build and Installation
---
Our app is build on the Prismatopia framework. If you would like to get your own local Community Calendar server running, clone this repo and follow this [guide here](https://prismatopia.dev/).


In order for the app to function correctly, the user must set up their own environment variables in addition to the variables required by Prismatopia.

Create a .env file that includes the following:

- CLOUDINARY_CLOUD_NAME - cloudinary cloud name
- CLOUDINARY_API_KEY - cloudinary API key
- CLOUDINARY_API_SECRET - cloudinary API secret

# Endpoints
---
The GraphQL API consists of a single endpoint. In addition to the built-in documentation available from the GraphQL playground, the following queries and mutations can be consumed to conduct CRUD operations on the Community Calendar database:

## Queries

| Query Name    	| Access Control      	| Description                            	|
|---------------	|---------------------	|----------------------------------------	|
| users (...)   	| authenticated users 	| Returns a list of users                	|
| user (...)    	| authenticated users 	| Get user's information and events      	|
| checkId (...) 	| Okta service        	| Verify whether a user already exists   	|
| events (...   	| all users           	| Returns a list of community events     	|
| tags (...)    	| all users           	| Returns a list of tags in the database 	|

## Mutations

| Mutation Name     	| Access Control      	| Description                                	|
|-------------------	|---------------------	|--------------------------------------------	|
| addUser (...)     	| Okta service        	| Creates a newly registered user            	|
| addEvent (...)    	| authenticated users 	| Create a community event                   	|
| updateEvent (...) 	| event creator       	| Update community event details             	|
| deleteEvent (...) 	| event creator       	| Remove a community event from the database 	|
| eventRsvp (...)   	| authenticated users 	| Connect a user to event RSVPs              	|
| eventSave (...)   	| authenticated users 	| A user can save an event to their profile  	|

# Available Scripts
---
Most scripts are run through the [make file](Makefile)

## npm run test
Launches the test runner in the interactive watch mode. First resets, regenerates, and redeploys a testing prisma service out of the `apollo/testing directory`.

Requires a testing instance of Prisma including a postgres database to be running and configured in `~/apollo/testing/prisma.yml`.

Default configuration of the testing `prisma.yml` will work if you have Docker Desktop installed and are running a postgres database image along with a local prisma service at http://localhost:4466.

See the [testing section](README.md#testing) for more information.

# Testing
---
Our test runner is Jest for unit and integration tests.

For integration testing, we simulate queries and mutations on the server through the `apollo-serving-testing` library's `createTestClient()` function. There are queries and mutations to simulate the expected client server calls written in graphql-tag in the `__tests__/__testMutation.js` and `__tests__/__testQuery.js` files.

## Setting up a testing Prisma service and database
The test runner is configured by default to run the test suite against a prisma service hosted locally at http://localhost:4000 with an accompanying and postgres database mounted by [Docker Desktop](https://www.docker.com/products/docker-desktop). Alternatively, you can configure the test runner to use a Prisma service deployed on the [Prisma Cloud](http://app.prisma.io).

## Running the tests with Docker Desktop
If you have Docker Desktop installed, you can set up your service and database by running docker-compose up from the apollo/testing folder of the repository. Use docker-compose up -d to run your instances in the background. You can find more information on the docker command line interface in their [documentation](https://docs.docker.com/engine/reference/commandline/cli/).

If you've run docker instances with the Prisma CLI before, you may run into the error: `ERROR: for prisma Cannot start service prisma: driver failed programming external connectivity on endpoint postgres_prisma_1 (b9aa3375c9374b77bab447b3777d1e5a7d78e0081106699b637065e6db4a5a88): Bind for 0.0.0.0:4466 failed: port is already allocated`.

You can clear your Docker setup using the following commands: `docker kill $(docker ps -aq) docker rm $(docker ps -aq)`

After that, docker-compose up should put your back in business.

Further Prisma documentation for configuring local Prisma servers with Docker is available here.

## Running the tests with Prisma Cloud
If don't have to or can't run Docker Desktop, you can modify the endpoint and secret values in prisma-client/testing/prisma.yml to match your deployed Prisma Cloud service.

## Testing architecture
Our test architecture is set up so that each time you run npm run test it resets, regenerates and redeploys your prisma service defined in `apollo/testing/prisma.yml` so you start from an empty database/ORM.

To create a Apollo Server instance that you can test, call the `constructTestServer()` function defined in `__tests/__testUtils.js`. When writing tests for resolvers that require authentication, you must pass in a valid `testUserId` out of your database as a parameter for `constructTestServer()`.

Since that database starts from empty for every test run, `__tests/__testUtils.js` also contains a `prismaConnection()` function that directly connects to your testing prisma service so you can create and delete test users during your setup and teardown.

Prisma does not provide a simple method for clearing all nodes from the service or data from the connected database, so every test must be written to "clean up" and created events or users when it is done running.

# Contributing 
---
When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](https://github.com/Lambda-School-Labs/community-calendar-be/blob/master/CODE_OF_CONDUCT.md). Please follow it in all your interactions with the project.

## Issue/Bug Request
__If you are having an issue with the existing project code, please submit a bug report under the following guidelines:__

- Check first to see if your issue has already been reported.
- Check to see if the issue has recently been fixed by attempting to reproduce the issue using the latest master branch in the repository.
- Create a live example of the problem.
- Submit a detailed bug report including your environment & browser, steps to reproduce the issue, actual and expected outcomes, where you believe the issue is originating from, and any potential solutions you have considered.
## Feature Requests
We would love to hear from you about new features which would improve this app and further the aims of our project. Please provide as much detail and information as possible to show us why you think your new feature should be implemented.

## Pull Requests
If you have developed a patch, bug fix, or new feature that would improve this app, please submit a pull request. It is best to communicate your ideas with the developers first before investing a great deal of time into a pull request to ensure that it will mesh smoothly with the project.

Remember that this project is licensed under the MIT license, and by submitting a pull request, you agree that your work will be, too.

## Pull Request Guidelines
- Ensure any install or build dependencies are removed before the end of the layer when doing a build.
- Update the README.md with details of changes to the interface, including new plist variables, exposed ports, useful file locations and container parameters.
- Ensure that your code conforms to our existing code conventions and test coverage.
- Include the relevant issue number, if applicable.
- You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.
## Attribution

These contribution guidelines have been adapted from this [good-Contributing.md-template](https://gist.github.com/PurpleBooth/b24679402957c63ec426).

# Prismatopia

Prismatopia is a GraphQL API stack combining a bunch of super-awesome technologies: Apollo Server 2, Prisma, Postgres, Docker, AWS, OAuth, Make, Yeoman and more!

[![Maintainability](https://api.codeclimate.com/v1/badges/015ff2fee461e3bc2b2b/maintainability)](https://codeclimate.com/github/Lambda-School-Labs/prismatopia/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/015ff2fee461e3bc2b2b/test_coverage)](https://codeclimate.com/github/Lambda-School-Labs/prismatopia/test_coverage)
![CI](https://github.com/Lambda-School-Labs/prismatopia/workflows/CI/badge.svg)
[![Dependency Status][daviddm-image]][daviddm-url]

## The Stack

This API is built as a very specific stack of technologies. There no options, other than configuring the existing stack components or swapping them out in your own copy. Enjoy!

Here are the technologies in this stack...

### Apollo Server 2

- Provides a GraphQL server for resolvers, which is where your business logic lives

### Prisma

- Provides an ORM to translate from Graphql to Postgres, Apollo resolvers mainly call a Prisma Client to access data

### Postgres

- Provides persistent storage for data, this is managed by AWS RDS in production but is run in a container during local development

### AWS

- Handles networking (ALB, VPC, etc.) and container management (ECS)

### OAuth

- Apollo is setup for validating JWTs from clients (Works with [Okta](https://www.okta.com/) out of the box)

### Docker

- There's a local Docker Compose setup for easy development. Also, all AWS services (except Postgres) run in containers

## Prismatopia Documentation

- [Main Documentation](prismatopia.md)
  - [The Apollo Layer](apollo/README.md)
  - [The Prisma Layer](prisma/README.md)
  - [The AWS Layer](aws/README.md)

## License

MIT © [Lambda School](https://lambdaschool.com)

[npm-image]: https://badge.fury.io/js/%40lambdaschool%2Fgenerator-prismatopia.svg
[npm-url]: https://www.npmjs.com/package/@lambdaschool/generator-prismatopia
[daviddm-image]: https://david-dm.org/Lambda-School-Labs/generator-prismatopia.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/Lambda-School-Labs/generator-prismatopia
