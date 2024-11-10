var express=require('express');
const db=require('../config/connection');

module.exports={
    checkLogin:(username,password)=>{
         return new Promise(async (resolve, reject) => {
          let response={}
           await db.promise().query('SELECT * FROM users WHERE username=?',[username]).then(([rows])=>{
              if(rows.length>0)
              {
                let status;
                var user=rows[0];
                if(user.password===password)
                {
                    response.user=user;
                    response.status=true;
                    resolve(response);
                }else{
                    resolve({status:false})
                    reject('Invalid');
                }
              }else{
                resolve({status:false})
                reject('Invalid');
              }
            }).catch((err)=>{
                reject(err);
            })
         })
    },
  
  sumbitDetails:(passport_no,first_name,last_name,date_of_birth,nationality,gender,issue_date,expiry_date,place_of_issue)=>{
    return new Promise(async (resolve, reject) => {
      
      const query='INSERT INTO passportdetails (passport_no, first_name, last_name, date_of_birth, nationality, gender, issue_date, expiry_date, place_of_issue) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

      await db.promise().query(query,[passport_no,first_name,last_name,date_of_birth,nationality,gender,issue_date,expiry_date,place_of_issue]).then((result)=>{
        resolve(result);
      }).catch((err)=>{
        reject(err);
        console.log("Error while Insertion");  
      })
    })
  },
  searchDetails: (passport_no) => {
    return new Promise((resolve, reject) => {
      let response = {};
      const query = 'SELECT * FROM PassportDetails WHERE passport_no = ?';
  
      db.promise().query(query, [passport_no])
        .then(([rows]) => {
          console.log("Query result:", rows); // Log the query result for debugging
          if (rows.length > 0) {
            response.status = true;
            response.user = rows[0]; // Use rows[0] to get a single user if expecting one record
            resolve(response);
          } else {
            resolve({ status: false });
          }
        })
        .catch((error) => {
          console.error("Database query error:", error);
          reject(error); // Reject with error if query fails
        });
    });
  },
  add: (data) => {
    return new Promise((resolve, reject) => {
      console.log('Data to be inserted:', data.user.passport_no); // Debugging: Check the data object
  
      const query = 'INSERT INTO blockdata (passport_no, first_name, last_name, date_of_birth, nationality, gender, issue_date, expiry_date, place_of_issue) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  
      db.promise().query(query, [
        data.user.passport_no, 
        data.user.first_name, 
        data.user.last_name, 
        data.user.date_of_birth, 
        data.user.nationality, 
        data.user.gender, 
        data.user.issue_date, 
        data.user.expiry_date, 
        data.user.place_of_issue
      ])
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        console.error('Error inserting data:', err);
        reject(err); // Reject if there's an error
      });
    });
  },
  delete:(data)=>{
    console.log(data);
    
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM PassportDetails WHERE passport_no = ?';
      db.promise().query(query, [data]).then((result)=>{
        resolve(result);
      })
    })
  },
  showblock: () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM blockdata';
      db.promise().query(query).then(([rows]) => {
        // Loop through each row in the result and log it
        rows.forEach((row, index) => {
          console.log(`Row ${index}:`, row);  // Logs each row object individually
        });
        
        resolve(rows); // Resolving with the entire rows array
      }).catch((err) => {
        console.error("Error in showblock:", err);
        reject(err);
      });
    });
},

update:(passport_no, first_name, last_name, date_of_birth, nationality, gender, issue_date, expiry_date, place_of_issue) => {
  return new Promise((resolve, reject) => {
    // Define the update query
    const query = `
      UPDATE PassportDetails
      SET 
        first_name = ?, 
        last_name = ?, 
        date_of_birth = ?, 
        nationality = ?, 
        gender = ?, 
        issue_date = ?, 
        expiry_date = ?, 
        place_of_issue = ?
      WHERE passport_no = ?
    `;

    // Execute the query with the provided data
    db.promise().query(query, [
      first_name,
      last_name,
      date_of_birth,
      nationality,
      gender,
      issue_date,
      expiry_date,
      place_of_issue,
      passport_no
    ])
    .then((result) => {
      resolve(result);
    })
    .catch((err) => {
      console.error('Error updating passport data:', err);
      reject(err);
    });
  });
}
  
}