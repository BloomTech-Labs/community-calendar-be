## Auth0 Environment Variables

### React App

**REACT_APP_AUTH0_DOMAIN** Auth0 app domain
**REACT_APP_AUTH0_CLIENT_ID** Auth0 app client id
**REACT_APP_API_AUDIENCE**
![audience](https://res.cloudinary.com/duoz4fpzs/image/upload/v1576261889/react_audience_wvftg0.png)

### Apollo server
**AUTH0_DOMAIN** Auth0 app domain
**API_AUDIENCE**
![audience](https://res.cloudinary.com/duoz4fpzs/image/upload/v1576261889/react_audience_wvftg0.png)

### Auth0 Rule 

**Add a rule to Auth0 account with the following:**
```
function (user, context, callback) {
    const {request} = require('graphql-request');
  	const namespace = 'https://mark-ap.herokuapp.com/';
    
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
      
    request('https://mark-ap.herokuapp.com/', query).then(result => {
      if(result.checkId.length){
              context.accessToken[namespace + 'cc_id'] = result.checkId[0].id;
        return callback(null, user, context);
      }
    
    request('https://mark-ap.herokuapp.com/', mutation).then(result => {
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