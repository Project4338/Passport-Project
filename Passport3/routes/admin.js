var express = require('express');
var router = express.Router();
var adminHelper = require('../help/adminHelper.js')

/* GET home page. */
const verifylogin=(req,res,next)=>{
  if(req.session.loggedIn)
  {
    next()
  }else{
    res.redirect('/')
  }
}

router.get('/', function(req, res) {
  const loginerror = req.query.loginerror === 'true';
  res.render('admin/loginpage',{loginerror});
});

router.post('/login', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  
  adminHelper.checkLogin(username, password).then((response) => {
    if (response.status) {
      req.session.loggedIn=true;
      req.session.user=response.user;
      res.redirect('/search');
    } else {
      res.redirect('/?loginerror=true');
    }
  }).catch((err) => {
    console.log(err);
    res.redirect('./');
  });
});

router.post('/sumbit',(req,res,next)=>{
  console.log("hello"); 
  console.log(req.body)

  var passport_no=req.body.passport_no
  var first_name=req.body.first_name
  var last_name=req.body.last_name
  var date_of_birth=req.body.date_of_birth
  var nationality=req.body.nationality
  var gender=req.body.gender
  var issue_date=req.body.issue_date
  var expiry_date=req.body.expiry_date
  var place_of_issue=req.body.place_of_issue

  var image=req.files.passport_image
   console.log('hello')

  adminHelper.sumbitDetails(passport_no,first_name,last_name,date_of_birth,nationality,gender,issue_date,expiry_date,place_of_issue).then((result)=>{
     if(result)
     {
      image.mv('./public/images/'+passport_no+'.jpg',(err,done)=>{
        if(!err)
          res.render('admin/created');
        else
        console.log(err);  
      })
     }
      
  }) 
});

router.post('/search',verifylogin, (req, res, next) => {
  
  const passport_no = req.body.passport_no;

  if (!passport_no) {
    return res.redirect('/search'); // Redirect if no passport number is provided
  }

  adminHelper.searchDetails(passport_no)
    .then((response) => {
      if (response.status) {
        let user = response.user;
        
        res.render('admin/view', { user });
      } else {
        res.redirect('/search?passportNotFound=true');
      }
    })
    .catch((error) => {
      console.error("Error in searchDetails:", error);
      res.status(500).send("Internal Server Error");
    });
});

router.post('/block',(req,res)=>{
 const passport_no=req.body.id;
 console.log(passport_no+"log");

 adminHelper.searchDetails(passport_no).then((data)=>{
  return adminHelper.add(data).then((response)=>{
    return adminHelper.delete(passport_no).then((result)=>{
      res.render('admin/sumbit',{result})
    })
  })
 })
 
});

router.get('/edit',verifylogin,(req,res)=>{
  let user=req.session.user;
  res.render('admin/edit1',{user})
});

router.get('/search',(req,res)=>{
  let user=req.session.user;
  const passportNotFound = req.query.passportNotFound === 'true';
  res.render('admin/search',{user,passportNotFound})
});
router.get('/create',verifylogin,(req,res)=>{
  let user=req.session.user;
  res.render('admin/create',{user})
});

router.post('/editing',(req,res)=>{
  const passport_no=req.body.passport_no;
  if (!passport_no) {
    return res.redirect('/edit'); // Redirect if no passport number is provided
  }

  adminHelper.searchDetails(passport_no)
    .then((response) => {
      if (response.status) {
        let user = response.user;
        res.render('admin/edit2',{user})
      } else {
        res.redirect('/edit');
      }
    })

 
});
router.post('/submit-passport-data',(req,res)=>{
  var passport_no=req.body.passport_no
  var first_name=req.body.first_name
  var last_name=req.body.last_name
  var date_of_birth=req.body.date_of_birth
  var nationality=req.body.nationality
  var gender=req.body.gender
  var issue_date=req.body.issue_date
  var expiry_date=req.body.expiry_date
  var place_of_issue=req.body.place_of_issue

  console.log(req.body);
  adminHelper.update(passport_no, first_name, last_name, date_of_birth, nationality, gender, issue_date, expiry_date, place_of_issue).then((result)=>{
    res.render('admin/saved')
  })
  
});
router.get('/blocked',verifylogin,(req, res) => {
  adminHelper.showblock()
    .then((data) => {
      // Log the data to check it
      console.log('Blocked Data:', data);
      let user=req.session.user;
      // Render the template and pass the data to it
      res.render('admin/block', { data ,user});
    })
    .catch((err) => {
      // Handle any error that might occur in showblock
      console.error('Error fetching blocked data:', err);
      res.status(500).send('Error fetching blocked data');
    });
});





module.exports = router;
