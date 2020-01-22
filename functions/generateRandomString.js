


function generateRandomString () {
  //Create a function that generates a string made of random characters
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const characterLength = 6;
  for(let i = 0; i < characterLength; i++) {
    result += characters.charAt(Math.floor(Math.random()* characterLength));
  }
  return result.toLocaleLowerCase();
}


module.exports = { generateRandomString };