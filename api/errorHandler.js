module.exports = function(err, req, res, next){
  if(res.headersSent){
    return next(err)
  }

  switch(err.name){
    case 'CastError':
      res.status(422).send({error: err});
      break;

    case 'ValidationError':
      const output = [];
      for(let i in err.errors){
        output.push(err.errors[i].message);
      }
      res.status(422).send({error: output});
      break;

    case 'UnauthorizedError':
      res.status(401).send({error: ['Invalid Token. Please login.']});
      break;

    default:
      res.status(500).send({error: ['Something went wrong. Please try again later.']});
      break;
  }
}