const cloudinary = require('cloudinary').v2;

module.exports = {
    convertTags,
    tagsToRemove,
    convertImages,
    imagesToRemove,
    cloudinaryImage
}

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

function tagsToRemove(oldTags, newTags) {
   return newTags ? oldTags.filter(oldTag => {
          return newTags.findIndex(newTag => {
              return oldTag.title === newTag.title
            }) === -1
      })
      .map(tag => ({id: tag.id})) : oldTags.map(tag => ({id: tag.id}));
}

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

function imagesToRemove(oldImages, newImages) {
  return newImages ? oldImages.filter(oldImage => {
         return newImages.findIndex(newImage => {
             return oldImage.url === newImage.url
           }) === -1
     })
     .map(image => ({id: image.id})) : oldImages.map(image => ({id: image.id}));
}

//cloudinary image upload
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