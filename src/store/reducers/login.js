const jwt = require('jsonwebtoken');
let defaultLogin = false;

// Check if token exists from previous session
if(localStorage.authToken){
  // decode token
  const token = jwt.decode(localStorage.authToken);

  if(token){
    // Check if token is still valid
    if(token.exp > Math.floor(Date.now() / 1000)){
      defaultLogin = true;
    }
  }
}

export default function(state=defaultLogin, action){
  switch(action.type){
    case 'SET_LOGIN': {
      state = action.payload;
      break;
    }

    default: break;
  }

  return state;
}