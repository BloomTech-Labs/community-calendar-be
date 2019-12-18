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


function (user, context, callback) {
    if(user && user.user_id){  
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
      
      const mutation = user.user_id && `
          mutation{
            adddUser(data: {
              auth0_id: "${user.user_id}"
            }){
                id
            }
        }`;
        
      request('https://ccstaging.herokuapp.com/', query).then(result => {
        if(result.checkId.length){
                context.accessToken[namespace + 'cc_id'] = result.checkId[0].id;
          return callback(null, user, context);
        }
        request('https://ccstaging.herokuapp.com/', mutation).then(result => {
          context.accessToken[namespace + 'cc_id'] = result.data.addUser.id;
          return callback(null, user, context);
        }).catch(err => {
         return callback(null, user, context);
        });
      }).catch(err => {
             return callback(null, user, context);
      });
    }else{
          return callback(null, user, context);
    }
      
    }