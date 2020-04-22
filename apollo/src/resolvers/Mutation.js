// @ts-check
'use strict'

const {
  cloudinaryImage
} = require('./helpers');

/**
 * @param {{ data: import('../generated/prisma-client').UserCreateInput }} args
 
 * @returns { Promise }
 */
module.exports.createUser = (_parent, args, { prisma }) => {
  console.log('createUser.args: %j', args)
  const { data } = args 
  data.profileImage =
      data.profileImage ||
      'https://res.cloudinary.com/communitycalendar/image/upload/c_scale,w_70/v1580068501/C_ncfz11.svg'
  const user = prisma.createUser(data)

  return user
}
// /**
//  * @param {{ data: import('../generated/prisma-client').UserUpdateInput }} args
 // * @ param {{ where: import('../generated/prisma-client').UserWhereUniqueInput}} args
//  * @returns { Promise  }
//  */

module.exports.updateUser = async (_, args, { prisma, req, decodedToken }) => {

    const decoded = await decodedToken(req);
    const { data, image } = args 
    if (image) {
      const imageUrl = await image.then(cloudinaryImage);
      data.profileImage = imageUrl 
    }

    const user = await prisma.updateUser({
      data, 
      where: { id: decoded['http://cc_id']}
    })
    return user

}
