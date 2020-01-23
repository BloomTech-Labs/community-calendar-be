## How to setup your own Community Calendar Prisma/PostgreSQL server on Heroku, and link it to your Auth0 account

## Prisma setup:

Create and log in to your account on [Prisma.io](https://prisma.io)

Click on **Servers** and then **ADD SERVER**

Enter a name to call your server and click **CREATE A SERVER**

Click **Create a new database** and select/connect to your Heroku account and create a database

Once database is created, click **SET UP A SERVER** to create a server on Heroku

After the Prisma server is deployed click **SERVICES** then **ADD A SERVICE**

If you haven't already, install Prisma globally with `npm install prisma -g`

Copy the string where it says **Log into Prisma CLI**

If you are already logged into [Prisma.io](https://www.prisma.io/), you can also type `prisma login` in your terminal. This *should* open up a new browser window prompting you to grant permission to the CLI.

cd into the **/prisma-client** folder

Paste and run the login string in your terminal. You should now be logged in.

Delete everything in **prisma.yml** file except:

```
datamodel: datamodel.prisma

generate:
  - generator: javascript-client
    output: ./generated/prisma-client/
  - generator: graphql-schema
    output: ./generated/prisma.graphql
```

Save the file.

***In our prisma.yml we are using env variables. This hides our Prisma endpoint to the public.  Using a secret also protects our Prisma service from unauthorized access.***

***In some of the following terminal commands you will notice a -e flag followed by the path to the .env file.  This flag is not necessary if you are hardcoding the endpoint in your prisma.yml. A secret is optional but recommended.***

**If using env variables, the `-e` flag must be used for `prisma reset`, `prisma deploy`, `prisma seed`, and `prisma generate`.**

Run `prisma deploy -e ../.env` in your terminal. Make sure you are in the prisma-client folder.

Under **Or deploy to an existing Prisma server:** select the server you created earlier.

Enter a name for the service and dev for stage.

After the service is deployed, copy the **endpoint** URL it wrote into the **prisma.yml** file.

cd back into the root directory `cd ../`

Create a `.env` file or `touch .env`

In the `.env` file, add variables called `PRISMA` and `SECRET`

Set `PRISMA` to the URL you copied earlier, and any secret phrase of your choice for `SECRET`. You will need to copy these into your Heroku config vars for your Apollo server later as well.

**Apollo server `.env` example:**

```
AUTH0_DOMAIN=<auth0 domain here>
API_AUDIENCE=<auth0 api audience here>
PRISMA=<prisma endpoint here>
SECRET=<custom secret here>
TICKET_MASTER=<Ticket Master API key here>
CLOUDINARY_CLOUD_NAME=<cloudinary cloud name here>
CLOUDINARY_API_KEY=<cloudinary api key here>
CLOUDINARY_API_SECRET=<cloudinary api secret here>
```

**React app `.env` example:**

```
REACT_APP_AUTH0_DOMAIN=<auth0 domain here>
REACT_APP_AUTH0_CLIENT_ID=<auth0 client id here>
REACT_APP_AUTH0_API_AUDIENCE=<auth0 api audience here>
REACT_APP_APOLLO_SERVER=<apollo server endpoint here>
REACT_APP_MAPBOX=<mapbox key here>
```

cd back into the **/prisma-client** folder

Delete the generated endpoint and add the following to the `prisma.yml` file:

```
endpoint: ${env:PRISMA}
secret: ${env:SECRET}
```

Here is what our prisma.yml currently looks like:

```
datamodel: datamodel.prisma
secret: ${env:SECRET}
endpoint: ${env:PRISMA}
seed:
  import: ./data/seed.graphql

generate:
  - generator: javascript-client
    output: ./generated/prisma-client/
  - generator: graphql-schema
    output: ./generated/prisma.graphql

```

Run `prisma generate -e ../.env`

Run `prisma deploy -e ../.env`

😊 Your Prisma endpoint should now be live and good to go 😊

## Deploy your Apollo server to Heroku

Add config vars from the `.env` file you created earlier and add `NODE_ENV` = `production` in your app's Heroku settings. Auth0 are variables explained at the end.

Example of what our Heroku env variables currently look like:
![envvariables_p7lvka.png](https://res.cloudinary.com/communitycalendar/image/upload/v1579796014/envvariables_p7lvka.png)

## Connecting your server to you own Auth0 account:


Login to Auth0 and click **CREATE APPLICATION**

Enter a name and select **Single Page Web Applications**

Go into the settings for the app you just created. You will need the value for **Domain** for the Apollo server and React app env variables. You will also need the **Client ID** value just for the React app.
![domain_client_id](https://res.cloudinary.com/duoz4fpzs/image/upload/v1576304216/domain_y5nbno.png)

You will also need the **API Audience** value for both your Apollo server and React app env variables. Click on **APIs** on the left and grab the url for **Auth0 Management API**.

![audience_zfqx4d.png](https://res.cloudinary.com/duoz4fpzs/image/upload/v1576304486/audience_zfqx4d.png)

You also need to add a rule to write Auth0 new user id's to your Prisma/Postgres database. It will get/add the user's community calendar id to the JWT/access token provided by Auth0.

Click on **Rules** on the left. Click **CREATE RULE**

Choose **Empty rule**

[Click here and use this code for the function for your auth0 rule](https://github.com/Lambda-School-Labs/community-calendar-be/blob/master/notes/auth0_rule.js). Replace the URL in both GraphQL requests with the endpoint of your deployed Apollo server.

Finally you must add the url of your localhost react app server and the deployed url to allowed callback URLs, allowed web origins, and allowed logour URLS.  **The URLS must not have a '/' at the end.** These settings are found in your applications dashboard on auth0.

Example of our staging auth0:
![callback urls example](https://res.cloudinary.com/communitycalendar/image/upload/v1579793739/callbacks_ysalgh.png)

### *The following is not required if you are developing with a deployed apollo server.*
## Connecting Auth0 to your local Apollo server

Auth0 needs a deployed Apollo server endpoint to be able to work correctly since it checks and stores the connected community calendar user id in the JWT it provides. If you want Auth0 to be able to connect to your local Apollo server you can [download and install ngrok](https://ngrok.com/). ngrok generates a url that allows your localhost server to be accessible across the internet.

Example: If your Apollo server is running locally on http://localhost:4000 open up ngrok and run `ngrok http 4000` It will generate an https url that you can use for both GraphQL requests in the Auth0 rule function above.

![df39f210.png](:storage\26afaf28-7599-4ce1-931b-fc44b0700996\c4de7864.png)
