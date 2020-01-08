function (user, context, callback) {
  const {request} = require('graphql-request');
  const namespace = 'http://';

  const first_name = user.user_metadata && user.user_metadata.first_name;
  const last_name = user.user_metadata && user.user_metadata.last_name;
  
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
          first_name: "${first_name}"
          last_name: "${last_name}"
        }){
            id
        }
    }`;

  //check if user is already in the community calendar database
  request('https://ccstaging.herokuapp.com', query).then(result => {
    if(result.checkId.length){
            //store user's community calendar id in the JWT
            context.accessToken[namespace + 'cc_id'] = result.checkId[0].id;
      return callback(null, user, context);
    }
    //add user to community calendar database if they aren't already in there
    request('https://ccstaging.herokuapp.com', mutation).then(result => {
      //store user's community calendar id in the JWT
      context.accessToken[namespace + 'cc_id'] = result.data.addUser.id;
      return callback(null, user, context);
    }).catch(err => {
     return callback(null, user, context);
    });
    
  }).catch(err => {
      return callback(null, user, context);
  });
}