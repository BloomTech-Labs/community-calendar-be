const cloudinary = require('cloudinary').v2;

module.exports = {
    convertTags,
    tagsToRemove,
    convertImages,
    imagesToRemove,
    cloudinaryImage
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//convert array of tags to match prisma tags schema
//connect tags that are already in the database
//create new tags
function convertTags(dataTags, tagsInDb) {
    const foundTags = [];
    const newTags = [];
    const tags = {};

    dataTags.forEach(tag => {
      tag.title = tag.title.toLowerCase();
      tagsInDb.findIndex(obj => {
         return obj.title === tag.title
       }) === -1
       ? newTags.push(tag)
       : foundTags.push(tag);
    })

    if(foundTags.length){
      tags.connect = foundTags;
    }

    if(newTags.length){
      tags.create = newTags;
    }

    return tags;
}

//compare tags tied to an event with new tags array to determine which ones to disconnect from the event
function tagsToRemove(oldTags, newTags) {
   return newTags ? oldTags.filter(oldTag => {
          return newTags.findIndex(newTag => {
              return oldTag.title === newTag.title
            }) === -1
      })
      .map(tag => ({id: tag.id})) : oldTags.map(tag => ({id: tag.id}));
}


//convert array of image urls to match prisma create/update images schema
//connect images that are already in the database
//create new images
function convertImages(dataImages, imagesInDb, creatorId) {
  const foundImages = [];
  const newImages = [];
  const images = {};

  dataImages.forEach(image => {
    const index = imagesInDb.findIndex(obj => {
       return obj.url === image.url
     });
     if(index === -1){
      newImages.push({...image, creator: {connect: {id: creatorId}}})
     }else{
      foundImages.push({id: imagesInDb[index].id});
     }
  })

  if(foundImages.length){
    images.connect = foundImages;
  }

  if(newImages.length){
    images.create = newImages;
  }

  return images;
}

//compare image urls tied to an event with new images array to determine which ones to disconnect from the event
function imagesToRemove(oldImages, newImages) {
  return newImages ? oldImages.filter(oldImage => {
         return newImages.findIndex(newImage => {
             return oldImage.url === newImage.url
           }) === -1
     })
     .map(image => ({id: image.id})) : oldImages.map(image => ({id: image.id}));
}

//cloudinary image upload helper
async function cloudinaryImage(file){
  const {createReadStream} = file;
  try {
    const result = await new Promise((resolve, reject) => {
      createReadStream().pipe(
        cloudinary.uploader.upload_stream((err, result) => {
          if(err){
            reject(err);
          }
          resolve(result);
        })
      )
    });

    return result.secure_url;
  }catch(err){
    console.log(err);
  }
}