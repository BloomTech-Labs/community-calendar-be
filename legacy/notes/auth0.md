## Auth0 Environment Variables

### React App

- **REACT_APP_AUTH0_DOMAIN** Auth0 app domain
- **REACT_APP_AUTH0_CLIENT_ID** Auth0 app client id
- **REACT_APP_API_AUDIENCE**
  ![audience](https://res.cloudinary.com/duoz4fpzs/image/upload/v1576261889/react_audience_wvftg0.png)

### Apollo server

- **AUTH0_DOMAIN** Auth0 app domain
- **API_AUDIENCE**
  ![audience](https://res.cloudinary.com/duoz4fpzs/image/upload/v1576261889/react_audience_wvftg0.png)

### Auth0 Rule

- **Add a rule to Auth0 account with the following:**

```
function (user, context, callback) {
  //used to make queries to community calendar apollo server
  const {request} = require('graphql-request');
  const namespace = 'http://';

  //check if names are in metadata. currently only working for accounts created by email without social providers
  const first_name = user.user_metadata && user.user_metadata.first_name;
  const last_name = user.user_metadata && user.user_metadata.last_name;
  
  //check to see if auth0 id is in community calendar database
  const query = `
      {
          checkId(data: {
            auth0Id: "${user.user_id}"
          }){
              id
          }
      }
  `;
  
  //add create a new user in community calendar database
  const mutation = `
      mutation{
        addUser(data: {
          auth0Id: "${user.user_id}"
          firstName: "${first_name}"
          lastName: "${last_name}"
        }){
            id
        }
    }`;
    
  return request('https://ccstaging.herokuapp.com', query).then(result => {
    //if auth0 id was found in our database, get their id and store it in access token and exit
    if(result.checkId.length){
            context.accessToken[namespace + 'cc_id'] = result.checkId[0].id;
      return callback(null, user, context);
    }
    //auth0 id was not found so create a new user in our database and store new id in access token
    request('https://ccstaging.herokuapp.com', mutation).then(result => {
      context.accessToken[namespace + 'cc_id'] = result.addUser.id;
      return callback(null, user, context);
    }).catch(err => {
     return callback(null, user, context);
    });
    
  }).catch(err => {
      return callback(null, user, context);
  });
}
```
