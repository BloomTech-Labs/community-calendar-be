module.exports = {
    convertTags,
    tagsToRemove,
    convertImages,
    imagesToRemove
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
   return oldTags.filter(oldTag => {
          return newTags.findIndex(newTag => {
              return oldTag.title === newTag.title
            }) === -1
      })
      .map(tag => ({id: tag.id}))
}

function convertImages(dataImages, imagesInDb) {
  const foundImages = [];
  const newImages = [];
  const images = {};

  dataImages.forEach(image => {
    imagesInDb.findIndex(obj => {
       return obj.url === image.url
     }) === -1
     ? newImages.push(image)
     : foundImages.push(image);
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
  return oldImages.filter(oldImage => {
         return newImages.findIndex(newImage => {
             return oldImage.url === newImage.url
           }) === -1
     })
     .map(image => ({id: image.id}))
}