## How to setup your own 📅Community Calendar📅 Prisma/PostgreSQL server connect to your Auth0 account

## Prisma setup:

Create and log in to your account on [Prisma.io](https://prisma.io)

Click on **Servers** and then **ADD SERVER**

Enter a name to call your server and click **CREATE A SERVER**

Click **Create a new database** and select/connect to your Heroku account and create a database

Once database is created, click **SET UP A SERVER** to create a server on Heroku

After the Prisma server is deployed click **SERVICES** then **ADD A SERVICE**

Copy the string where it says **Log into Prisma CLI**

If you haven't already, install Prisma globally with `npm install prisma -g`

cd into the **/prisma-client** folder

Paste and run the login string in your terminal. You should now be logged in.

Delete everything in **prisma.yml** file except:
```
datamodel: datamodel.prisma

generate:
  - generator: javascript-client
    output: ./generated/prisma-client/
``` 
Save the file.

Run `prisma deploy` in your terminal. Make sure you are in the prisma-client folder.

Under **Or deploy to an existing Prisma server:** select the server you created earlier.

Enter a name for the service and dev for stage.

After the service is deployed, copy the **endpoint** URL it wrote into the **prisma.yml** file.

cd back into the root directory `cd ../`

Create a `.env` file or `touch .env`

In the `.env` file, add variables called `PRISMA` and `SECRET`

Set `PRISMA` to the URL you copied earlier, and any secret phrase of your choice for `SECRET`. You will need to copy these into your Heroku config vars for your Apollo server later as well.

**Apollo server `.env` example:**
```
AUTH0_DOMAIN=YOUR_AUTH0_APP_DOMAIN_HERE
API_AUDIENCE=YOUR_AUTH0_API_AUDIENCE_HERE
PRISMA=https://mark-demo-8d3dcae763.herokuapp.com/demo/dev`
SECRET=dogsarecool
```

**React app `.env` example:**
```
REACT_APP_AUTH0_DOMAIN=YOUR_AUTH0_APP_DOMAIN_HERE
REACT_APP_AUTH0_CLIENT_ID=YOUR_AUTH0_CLIENT_ID_HERE
REACT_APP_API_AUDIENCE=YOUR_AUTH0_API_AUDIENCE_HERE
```

cd back into the **/prisma-client** folder

Delete the generated endpoint and add the following to the `prisma.yml` file:
```
endpoint: ${env:PRISMA}
secret: ${env:SECRET}
```

It should now look something like 
```
datamodel: datamodel.prisma
endpoint: ${env:PRISMA}
secret: ${env:SECRET}

generate:
  - generator: javascript-client
    output: ./generated/prisma-client/
```

Run `prisma generate -e ../.env`

Run `prisma deploy -e ../.env`

😊 Your Prisma endpoint should now be live and good to go 😊

## Deploy your Apollo server to Heroku
Add config vars from the `.env` file you created earlier and add `NODE_ENV` = `production` in your app's Heroku settings. Auth0 are variables explained at the end. 

Example:
![config_variables](https://res.cloudinary.com/duoz4fpzs/image/upload/v1576303244/config_vars_dxdhdt.png)

## Connecting your server to you own Auth0 account:

Login to Auth0 and click **CREATE APPLICATION**

Enter a name and select **Single Page Web Applications**

Go into the settings for the app you just created.  You will need the value for **Domain** for the Apollo server and React app env variables.  You will also need the **Client ID** value just for the React app.
![domain_client_id](https://res.cloudinary.com/duoz4fpzs/image/upload/v1576304216/domain_y5nbno.png)

You will also need the **API Audience** value for both your Apollo server and React app env variables.  Click on **APIs** on the left and grab the url for **Auth0 Management API**.

![audience_zfqx4d.png](https://res.cloudinary.com/duoz4fpzs/image/upload/v1576304486/audience_zfqx4d.png)

Finally you need to add a rule to write Auth0 new user id's to your Prisma/Postgres database. It will get/add the user's community calendar id to the JWT/access token provided by Auth0.

Click on **Rules** on the left. Click **CREATE RULE**

Choose **Empty rule**

Use the following function for the rule. Replace the URL in both GraphQL requests with the endpoint for your deployed Apollo server:

```
function (user, context, callback) {
    const {request} = require('graphql-request');
  	const namespace = 'http://';
    
    const query = `
        {
            checkId(data: {
              auth0_id: "${user.user_id}"
            }){
                id
            }
        }
    `;
    
    const mutation = `
        mutation{
          addUser(data: {
            auth0_id: "${user.user_id}"
          }){
              id
          }
      }`;
      
    request('YOUR_APOLLO_SERVER_URL_HERE', query).then(result => {
      if(result.checkId.length){
              context.accessToken[namespace + 'cc_id'] = result.checkId[0].id;
        return callback(null, user, context);
      }
      request('YOUR_APOLLO_SERVER_URL_HERE', mutation).then(result => {
        console.log('afsdfsdf', result);
        context.accessToken[namespace + 'cc_id'] = result.data.addUser.id;
        return callback(null, user, context);
      }).catch(err => {
       return callback(err);
      });
      
    }).catch(err => {
        return callback(err);
    });
  }
```

## Connecting Auth0 to your local Apollo server

Auth0 needs a deployed Apollo server endpoint to be able to work correctly since it checks and stores the connected community calendar user id in the JWT it provides.  If you want Auth0 to be able to connect to your local Apollo server you can [download and install ngrok](https://ngrok.com/). ngrok generates a url that allows your localhost server to be accessible across the internet.

Example: If your Apollo server is running locally on http://localhost:4000 open up ngrok and run `ngrok http 4000` It will generate an https url that you can use for both GraphQL requests in the Auth0 rule function above.

![df39f210.png](:storage\c7df0e58-bb8c-424b-a3b4-2c5d06b52fea\df39f210.png)
