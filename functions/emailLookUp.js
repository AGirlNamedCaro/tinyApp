
const emailLookUp = (email,object) => {
  //Create a function that takes in an email and an object
    //Iterate through the object
      //If the email matches the value of the object.user_id.email return true
      //else return false
  for(const key in object) {
    if(email === object[key]['email']) {
      return object[key]['id'];
    }
  }
      
    return null
      
}

module.exports = { emailLookUp };