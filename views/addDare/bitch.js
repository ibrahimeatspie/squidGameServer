
let password = "bilbo"
let user;
function addToDB(){

    getUsers();

//first we need to get all the documents in the database


}


function getUsers(){

  fetch("http://localhost:5002/players")
    .then(response=> response.json())
    .then(data=> data)
    .then(users => verifyUser(users))
  }

function verifyUser(users){
  //console.log(users);
  for ( i= 0; i < users.length; i++){
   // console.log(users[i].name);
    if(users[i].password == password){
      //console.log(users[i].name+" has a matching password");
      user = users[i];
      
    }
  }
 

}

function submit(){
  const data = user;

  fetch('http://localhost:5002/toggleSubmit', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then((response) => response.json())
  .then((data) => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
  
  console.log(user.name+" toggled to submit")

}

function notSubmit(){
  console.log(user.name+" has toggled to not submit")
}