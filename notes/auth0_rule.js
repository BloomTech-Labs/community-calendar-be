function (user, context, callback) {
  const {request} = require('graphql-request');
  const namespace = 'http://';

  const first_name = user.user_metadata && user.user_metadata.first_name || user.given_name;
  const last_name = user.user_metadata && user.user_metadata.last_name || user.family_name;
  
  const query = `
      {
          checkId(data: {
            auth0Id: "${user.user_id}"
          }){
              id
          }
      }
  `;
  
  const mutation = `
      mutation{
        addUser(data: {
          auth0Id: "${user.user_id}"
          firstName: "${first_name}"
          lastName: "${last_name}"
          profileImage: "${user.picture}"
        }){
            id
        }
    }`;
    
  return request('https://ccapollo-production.herokuapp.com', query).then(result => {
    if(result.checkId.length){
            context.accessToken[namespace + 'cc_id'] = result.checkId[0].id;
      return callback(null, user, context);
    }
    request('https://ccapollo-production.herokuapp.com', mutation).then(result => {
      context.accessToken[namespace + 'cc_id'] = result.addUser.id;
      return callback(null, user, context);
    }).catch(err => {
      console.log(err);
     return callback(new Error("Error logging in"), null, null);
    });
    
  }).catch(err => {
      console.log(err);
      return callback(new Error("Error logging in"), null, null);
  });
}