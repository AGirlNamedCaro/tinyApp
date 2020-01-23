
const urlsForUser = (user_id, object) => {
  //Create a function that takes in a user_id and an object
    //Iterates through the object comparing it with the objectID
      //if the user id is in the object (currently logged aka cookies)
        //return the urls associated with that id
      //else display a message telling the user to log in
  const shortenedURLS = {}
  for(const key in object) {
    if(user_id === object[key]["userID"]) {
        shortenedURLS[key] = object[key]['longURL']
          
        }
      }
      return shortenedURLS;
    }

  
  




module.exports = { urlsForUser };