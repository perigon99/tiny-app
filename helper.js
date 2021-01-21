const getUserByEmail = function(email, database) {
  // lookup magic...
  for (let user in database) {
    if(database[user].email === email) {
      return user;
    }
  }
  return undefined;
};

const emailChecker = (sourceEmail, bdEmail) => {
  for (let record in bdEmail) {
    if(sourceEmail === bdEmail[record].email) {
      return true    
    }
  }
};

const generateRandomString = () => {
  const prefix = "id"
  return prefix + Math.random().toString(36).substring(7)
};

module.exports = {getUserByEmail, emailChecker, generateRandomString};