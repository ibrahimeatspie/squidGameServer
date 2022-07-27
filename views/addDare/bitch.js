

function addToDB(){



  let currTime = new Date();

  let date1 = [currTime.getFullYear(), currTime.getMonth(),
             currTime.getDate(), currTime.getHours(), currTime.getMinutes(), 
             currTime.getSeconds()+60, currTime.getMilliseconds()]

  let date2 = [currTime.getFullYear(), currTime.getMonth(),
              currTime.getDate(), currTime.getHours(), currTime.getMinutes(), 
              currTime.getSeconds()+61, currTime.getMilliseconds()]


  let date3 = [currTime.getFullYear(), currTime.getMonth(),
                currTime.getDate(), currTime.getHours(), currTime.getMinutes(), 
                currTime.getSeconds()+62, currTime.getMilliseconds()]



 
  
  console.log("Date 1: "+date1)
  console.log("date 2: "+date2);
  console.log("date 3: "+date3);
  
  let roundDescription = "Record and upload a video of you  at the library";
  
  let requestBody1 = {
    date: date1,
    roundDescription: roundDescription
  }
  let requestBody2 = {
    date: date2,
    roundDescription: roundDescription
  }
  let requestBody3 = {
    date: date3,
    roundDescription: roundDescription
  }


  let fr1 = {
  
      method:'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody1)
    
  };
  let fr2 = {
  
    method:'POST',
    headers:{
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody2)
  
};

let fr3 = {
  
  method:'POST',
  headers:{
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(requestBody3)

};

  

  
  fetch('/addDare', fr1)
  .then(response => response.json())
  .then(data => {
    console.log(data);
  });

  fetch('/addDare', fr2)
  .then(response => response.json())
  .then(data => {
    console.log(data);
  });

  fetch('/addDare', fr3)
  .then(response => response.json())
  .then(data => {
    console.log(data);
  });

}


