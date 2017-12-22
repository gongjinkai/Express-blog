var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var ModelUser = require("../model/user");
var model = require("../model/content");
var Demo = model.Demo;
/* GET home page. */

router.get('/', function(req, res, next) {
    /*
  res.render('index', {
      title: 'Express',
      author: 'Gongjinkai',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
  });
  */
    Demo.find(function(err,docs){
        var message = ['apple','banana','orange'];
        res.render('index',{
            username: req.session.user,
            title: 'Express',
            author: 'Gongjinkai',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString(),
            demos: docs,
            message: message,
            num: docs.length
        })
    })
});

router.get("/login",function(req,res,next){
  res.render("login", {
      title:'登录',
      user: req.session.username,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
  });
});
router.post("/login",function(req,res,next){
    var postData={
        name:req.body.username
    };
    ModelUser.findOne(postData,function(err,data){
        if(err){
            console.log(err);
        }
        if(data){
            if(data.password === req.body.password){
                req.session.user = req.body.username;
                req.flash('success','登录成功')
                res.redirect('/success');
            }else{
                req.flash('error','密码错误')
                res.redirect('/login');
                //res.send("密码错误");
            }
        }else{
            req.flash('error','没有此用户')
            res.redirect('/login');
            //res.send("没有此用户");
        }
    });
});
router.get("/reg",function(req,res,next){
  res.render("reg",{
      title:'注册',
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
  });
});
//注册
router.post("/reg",function(req,res,next){
  var postData={
    name:req.body.username,
    password:req.body.password
  };
  ModelUser.create(postData,function(err,data){
        if(err) {
          console.log(err);
          req.flash('error','该用户已被注册');
        }
        req.flash('success','注册成功');
        //res.send(data);
  })
});
router.get("/success",checkLogin)
router.get("/success",function(req,res,next){
    res.render("success", {
        title:'登录成功',
        username: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});




router.get("/success_ajax",function (req, res, next) {
    res.json({
        user:'zhangsan',
        password: '000000'
    })
})

router.post("/success",function (req, res, next) {
    var demo = new Demo({
        uid: req.body.uid,
        name: req.session.user,
        title: req.body.title,
        content: req.body.content
    });
    demo.save(function(err,doc){
        console.log(doc);
        res.redirect('content')
    })
})

router.get('/logout', function (req, res) {
    req.session.user = null; // 删除session
    return res.redirect('/');
});

//内容页面
router.get('/content',checkLogin)
router.get('/content',function (req, res) {
    Demo.find(function(err,docs){
        res.render('content',{
            username: req.session.user,
            title: '发表的内容',
            demos: docs
        })
    })
})

//爬虫页面
router.get('/cpider',function(req,res){
    request('https://github.com/baiqingchun/webchat_express/blob/master/app.js', function (error, response, body) {
            var $ = cheerio.load(body); //当前的$符相当于拿到了所有的body里面的选择器
            var navText=$('.js-file-line-container').html(); //拿到导航栏的内容
            res.send(navText);
    })
});

function checkLogin(req,res,next){
    if(!req.session.user){
        req.flash('error','未登录')
        res.redirect('/login')
    }
    next();
}

function checkNotLogin(req,res,next){
    if(req.session.user){
        req.flash('success','已经登录')
        res.redirect('back')
    }
    next();
}

module.exports = router;
