

const getKeyByValue = (object,value) => {
  //Create a function that will take in two arguments and produce the key of the value inputted
    //iterate through the object & get to the level where it reaches the email key
    //check if the value matches the key & return key

  for(const key in object) {
    if(object[key]['email'] === value) {
      return object[key]['id'];
    }
  }

  return false;

}


module.exports = { getKeyByValue };