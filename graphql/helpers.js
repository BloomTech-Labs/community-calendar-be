module.exports = {
    convertTags,
    tagsToRemove
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