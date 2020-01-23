const { assert } = require('chai');
const { emailLookUp } = require('../emailLookUp');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}


describe('#emailLookUp', function() {
  it('should return a user with a valid email', function() {
    const user = emailLookUp('user@example.com', testUsers)
    const expectedOutput = 'userRandomID';

    assert.equal(user,expectedOutput);
  })

  it('should return null with an invalid email', function() {
    const user = emailLookUp('user3@example.com', testUsers)
    const expectedOutput = null;

    assert.equal(user,expectedOutput);
  })
})