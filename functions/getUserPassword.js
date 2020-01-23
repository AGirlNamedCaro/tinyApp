

const getUserPassword = (user_id, object) =>  {
  //Iterate through the object
    //Make it to the name,email level
    //check if it matches the key & return
    for(const key in object) {
      if(object[key]['id'] === user_id) {
        return object[key]['password'];
      }
    }
  
    return false;
}



module.exports = { getUserPassword };