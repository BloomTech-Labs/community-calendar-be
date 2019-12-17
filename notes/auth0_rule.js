function (user, context, callback) {
  const {request} = require('graphql-request');
  const namespace = 'http://';
  const query = `
          {
              checkId(data: {
                auth0_id: "${user.user_id || 'test'}"
              }){
                  id
              }
          }
      `;

  const mutation = `
        mutation {
            addUser(data: {
                auth0_id: "${user.user_id}"
                first_name: "${user.user_metadata.first_name}"
                last_name: "${user.user_metadata.last_name}"
            }){
                id
            }
        }
    `;

  request('https://ccstaging.herokuapp.com/', query)
    .then(result => {
      if (result.checkId.length) {
        context.accessToken[namespace + 'cc_id'] = result.checkId[0].id;
      }else{
        request('https://ccstaging.herokuapp.com/', mutation)
          .then(result => {
            context.accessToken[namespace + 'cc_id'] = result.data.addUser.id;
          })
          .catch(err => {
            console.log(err);
          });
      }
    })
    .catch(err => {
      console.log(err);
    });
    return callback(null, user, context);
}
