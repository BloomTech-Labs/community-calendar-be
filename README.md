![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Community Calendar Back End

We create incredible neighborhoods and community spaces through meaningful shared events. You can find the deployed project at [Community Calendar](https://www.communitycalendar.xyz).

This back end API is consumed by three clients:

1. Web application at [React Front End Repository](https://github.com/Lambda-School-Labs/community-calendar-fe).
2. iOS application at [iOS Application Repository](https://github.com/Lambda-School-Labs/community-calendar-ios).
3. Android application at [Android Application Repository](https://github.com/Lambda-School-Labs/community-calendar-android).

## Contributors

| [Skyler Dowdy](https://github.com/skylerwebdev) | [Louis Gelinas](https://github.com/gelinas) | [Lowell Jacobs](https://github.com/lowell1) | [Mark King](https://github.com/markpkng) | [Ben Rogers](https://github.com/thisbenrogers) | [Westley Strellis](https://github.com/wstrellis) |

## Project Overview

[Product Vision](https://www.notion.so/Community-Calendar-Labs-19-25c4624fa8fe46e49361d73215459050)

[Planned Releases](https://www.notion.so/06de41bdd6124a459140e0b943b648a1)

Community Calendar Backend repository contains code for the three services in our stack.

<!-- Integrate future image of back architecture, including authentication token flow -->

1. An Apollo GraphQL service in the root directory that conducts business logic on GraphQL queries with data collected from the database and authentication services.

2. A Prisma Database ORM service defined in the `/prisma-client/` directory. The `prisma-client` is ready for deployment on any Prisma implementation, including free deployment on Heroku through [Prisma Cloud](https://www.prisma.io/cloud).

3. An Auth0 authentication application hosted on [Auth0](https://www.auth0.com) with custom rules and forms defined in the `/notes/` directory.

### Key Features

- Serve a list of community events (RC 1)
- Allow users to create accounts with Google, Facebook, or an email address (RC 1)
- Geocode event addresses into lattitude and longitude for location based searching (RC 2)
- Allow community members to create and update their own events (RC 2)
- Allow community members to RSVP to events (RC 3)
- Integrate external event APIs from Ticketmaster, Facebook, and EventBrite (RC 4+)

## Backend Framework

We chose an Apollo GraphQL server of a RESTful API for the two reasons:

1. Allow web and mobile clients to request the exact event details they have space to render. This prevents overfetching and increases performance on mobile.

2. Allow the Community Calendar API to be seamless expanded to include integration of event data from external APIs in future releases

## Build and Installation

Our server relies on Auth0 and another Prisma/PostgreSQL deployment to function correctly. If you would like to get your own local Community Calendar server running, clone this repo and follow [this guide here](https://github.com/Lambda-School-Labs/community-calendar-be/blob/master/notes/prisma_auth0.md).

Once **Auth0** and **Prisma** is configured:

- `npm install` to install all required dependencies
- `npm run dev` to start the local server
- vist your endpoint URL to interact with your server through the GraphQL Playground

## Environment Variables

In order for the app to function correctly, the user must set up their own environment variables.

Create a .env file that includes the following:
  
 _ AUTH0_DOMAIN - Auth0 domain for your Auth0 application.
_ API_AUDIENCE - Auth0 API Audience
_ NODE_ENV - Not required for local environment. Set to "production" when deploying.
_ PRISMA - This is the endpoint for the Prisma deployment.
_ SECRET - Secret used for Prisma service.
_ TICKET_MASTER - Ticket Master API key.

## Endpoints

The GraphQL API consists of a single endpoint. In addition to the built-in documentation available from the GraphQL playground, the following queries and mutations can be consumed to conduct CRUD operations on the Community Calendar database:

### Queries

| Query Name      | Access Control      | Description                           |
| --------------- | ------------------- | ------------------------------------- |
| `users (...)`   | authenticated users | Returns a list of users.              |
| `checkId (...)` | auth0 service       | Verify whether a user already exists. |
| `events (...)`  | all users           | Returns a list of community events.   |

### Mutations

| Mutation Name       | Access Control      | Description                                 |
| ------------------- | ------------------- | ------------------------------------------- |
| `addUser (...)`     | auth0 service       | Creates a newly registered user.            |
| `addEvent (...)`    | authenticated users | Create a community event.                   |
| `updateEvent (...)` | event creator       | Update community event details.             |
| `deleteEvent (...)` | event creator       | Remove a community event from the databsae. |

## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](./CODE_OF_CONDUCT.md). Please follow it in all your interactions with the project.

### Issue/Bug Request

**If you are having an issue with the existing project code, please submit a bug report under the following guidelines:**

- Check first to see if your issue has already been reported.
- Check to see if the issue has recently been fixed by attempting to reproduce the issue using the latest master branch in the repository.
- Create a live example of the problem.
- Submit a detailed bug report including your environment & browser, steps to reproduce the issue, actual and expected outcomes, where you believe the issue is originating from, and any potential solutions you have considered.

### Feature Requests

We would love to hear from you about new features which would improve this app and further the aims of our project. Please provide as much detail and information as possible to show us why you think your new feature should be implemented.

### Pull Requests

If you have developed a patch, bug fix, or new feature that would improve this app, please submit a pull request. It is best to communicate your ideas with the developers first before investing a great deal of time into a pull request to ensure that it will mesh smoothly with the project.

Remember that this project is licensed under the MIT license, and by submitting a pull request, you agree that your work will be, too.

#### Pull Request Guidelines

- Ensure any install or build dependencies are removed before the end of the layer when doing a build.
- Update the README.md with details of changes to the interface, including new plist variables, exposed ports, useful file locations and container parameters.
- Ensure that your code conforms to our existing code conventions and test coverage.
- Include the relevant issue number, if applicable.
- You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

### Attribution

These contribution guidelines have been adapted from [this good-Contributing.md-template](https://gist.github.com/PurpleBooth/b24679402957c63ec426).
