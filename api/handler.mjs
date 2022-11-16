import {crudy,database} from 'crudit' ;
import {IncomingMessage, ServerResponse} from 'http'
import crypto from 'crypto'


 // changed to module
 crudy.config(function(config){
  config.settings.database='test';
  config.settings.roles=['owner'];
});



crudy.request("login", "post",false,async function(request,loggedUser,config){
  database.init(process.env.DBURL, {});
  let hash= crypto.createHash('md5').update(request.body.password).digest('hex');
  let user= await database.search("global","users",{username:request.body.username, password:hash, active:true});
  if(!user || user.length!=1) throw new Error("Wrong username and password");
  user=user[0];
  let newToken= crypto.randomBytes(64).toString('hex');
  let token={userId: user._id,token: newToken, expireAt:0};
  token=await database.insert("global","tokens",token);  
  delete user.password;
  delete user.db;
  user.token=newToken;
  return user;
});

crudy.request("register", "post",false,async function(request,loggedUser,config){

  database.init(process.env.DBURL, {});
  let user=request.body;
  delete user.token;
  user.password= crypto.createHash('md5').update(user.password).digest('hex');
  user.db=("c_"+user.username??'sdff').normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 ]/g, '')
  user.active=true;
  user= await database.insert("global","users",user);    
  return user;
});

// crudy.mapEntity('goal',{
//   computedFields:{
//     "color": function(data){
//       let code=data_id.charCodeAt(0);
//       let colors=['orange','blue', 'purple']
//       let colorId=code % colors;
//     }
//   }
// });

crudy.authorize(async function(request){
  database.init(process.env.DBURL, {});
  let token=request.headers.authorization ?? request.query.authorization;
  let users=await database.aggregate('global','users',[{
    $lookup:
      {
        from: 'tokens',
        localField: '_id',
        foreignField: 'userId',
        as: 'token',
      },
     
 }, {
     "$match": {
       "token.token": token
     }
   }]);
  if(users==null || users.length!=1 || !users[0].active) return  null;
  let user=users[0];
  return {
      name:user.name,
      roles:['owner'],
      database:user.db
  };
  
});

export default async function handler(request, response) {
  
  return await crudy.run(request,response);
}
