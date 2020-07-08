var express     = require("express"),
methodOverride  = require("method-override"),
expressSanitizer=require("express-sanitizer"),
bodyParser      =require("body-parser"),
flash           =require("connect-flash"),
passport        =require("passport"),
LocalStrategy   =require("passport-local"),
passportLocal   =require("passport-local-mongoose"),
mongoose        =require("mongoose"), 
app             =express();

mongoose.connect("mongodb+srv://dbUser:dbUser@cluster0-asksu.mongodb.net/restful_blog_app?retryWrites=true&w=majority");
app.use(require("express-session")({
    secret:"Hey is this Samarth",
    resave:false,
    saveUninitialized:false 
}));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(flash());
app.use(function(req,res,next){
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

var likeSchema = new mongoose.Schema({
    name:String
})
var replySchema = new mongoose.Schema({
    ans:String,
    name:String
})
var ansSchema=new mongoose.Schema({
    ans:String,
    name:String,
    like:Number,
    reply:[replySchema],
    liked:[likeSchema]
})
var blogSchema = new mongoose.Schema({
    title: String,
    image:String,
    body:[ansSchema],
    created: {type:Date,default:Date.now},
    name:String,
    genre:String
    
});
var UserSchema= new mongoose.Schema({
    
    username:String,
    password:String
    
    
    
})

UserSchema.plugin(passportLocal);

var Ans=mongoose.model("Ans",ansSchema);

var Blog=mongoose.model("Blog",blogSchema);

var User=mongoose.model("User",UserSchema);

var Reply= mongoose.model("Reply",replySchema);

var Like= mongoose.model("Like",likeSchema);

passport.use(new LocalStrategy(User.authenticate()));  
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


function isLoggedIn(req,res,next){ 
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First!");
    res.redirect("/log");
}

app.get("/",function(req,res){
    
    Blog.find({},function(err,blogs){
        if (err){
            console.log("ERROR!");
        }
        else{
            res.render("all",{blogs:blogs,currUser:req.user});
            
        }
    })
    
    
    
})

app.get("/log",function(req,res){
    
    res.render("signup");
})

app.post("/login",passport.authenticate("local",{
    
    successRedirect: "/",
    failureRedirect: "/log"
}),function(req,res){ 
    
    

   
});

app.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Successfully logged out!");
    res.redirect("/");
});


app.get("/content",function(req,res){
    Blog.find({name:req.user.username},function(err,foundBlog){
        if(err){
            console.log(err);
        }
        else{
            res.render("content",{blogs:foundBlog,currUser:req.user})
        }
    })
})

app.get("/content/ans",function(req,res){
    Blog.find({},function(err,foundBlog){
        if(err){
            console.log(err);
        }
        else{
            res.render("answered",{blogs:foundBlog,currUser:req.user})
        }
    })
})

app.get("/sign",function(req,res){
    res.render("sign");
})

app.post("/signin",function(req,res){
    
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            
            return res.redirect("/");
        }
        
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Signed in as "+ user.username);
            res.redirect("/");
         });
        
    });

    

})



app.get("/blogs/academics",isLoggedIn,function(req,res){
    Blog.find({genre:"Academics"},function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("academics",{blogs:foundBlog,currUser:req.user});
            
        }
    })
})

app.get("/blogs/hostel",isLoggedIn,function(req,res){
    Blog.find({genre:"Hostel"},function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("hostel",{blogs:foundBlog,currUser:req.user});
            
        }
    })
})

app.get("/blogs/mess",isLoggedIn,function(req,res){
    Blog.find({genre:"Mess"},function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("mess",{blogs:foundBlog,currUser:req.user});
            
        }
    })
})

app.get("/blogs/roomallotment",isLoggedIn,function(req,res){
    Blog.find({genre:"RoomAllotment"},function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("RoomAllotment",{blogs:foundBlog,currUser:req.user});
            
        }
    })
})

app.get("/blogs/books",isLoggedIn,function(req,res){
    Blog.find({genre:"Books"},function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("books",{blogs:foundBlog,currUser:req.user});
            
        }
    })
})

app.get("/blogs/projects",isLoggedIn,function(req,res){
    Blog.find({genre:"Projects"},function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("projects",{blogs:foundBlog,currUser:req.user});
            
        }
    })
})

app.get("/blogs/faculty",isLoggedIn,function(req,res){
    Blog.find({genre:"Faculty"},function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("faculty",{blogs:foundBlog,currUser:req.user});
            
        }
    })
})

app.get("/blogs/subjects",isLoggedIn,function(req,res){
    Blog.find({genre:"Subjects"},function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("subjects",{blogs:foundBlog,currUser:req.user});
            
        }
    })
})

app.get("/blogs/ffcs",isLoggedIn,function(req,res){
    Blog.find({genre:"FFCS"},function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("ffcs",{blogs:foundBlog,currUser:req.user});
            
        }
    })
})

app.get("/blogs/transport",isLoggedIn,function(req,res){
    Blog.find({genre:"Transport"},function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("transport",{blogs:foundBlog,currUser:req.user});
            
        }
    })
})
app.get("/answer",isLoggedIn,function(req,res){
    Blog.find({},function(err,blogs){
        if (err){
            console.log("ERROR!");
        }
        else{
            res.render("answer",{blogs:blogs,currUser:req.user});
        }
    })
})

//NEW
app.get("/blogs/new",isLoggedIn,function(req,res){
    
    res.render("new",{currUser:req.user});
})
//RESTFUL ROUTES
app.post("/",isLoggedIn,function(req,res){
    req.body.blog.name=req.user.username;
    if(req.body.blog.title!=""){
        
        Blog.create(req.body.blog,function(err,newBlog){
            if(err){
                console.log(err);
            }else{
                req.flash("success","Post added successfully!")
                res.redirect("/");
                
            }
        }) 
    }else{
        res.redirect("/");
    }
})

app.get("/blogs/:id",isLoggedIn,function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log(err);
        }else{
            
             res.render("ans",{blog:foundBlog,currUser:req.user});
        }
    })
    
})

app.put("/blogs/:id/like",isLoggedIn,function(req,res){
    req.body.like.name=req.user.username;
    Like.create(req.body.like,function(err,like){
        if(err){
            console.log(err);
        }else{
            Blog.findById(req.params.id,function(err,foundBlog){
                if(err){
                    console.log(err);
                }else{
                    
                    foundBlog.body[0].like+=1;
                    foundBlog.body[0].liked.push(like);
                    foundBlog.save();
                    console.log(foundBlog);
                    Blog.findByIdAndUpdate(req.params.id,foundBlog,function(err,blogs){
                        if(err){
                            console.log(err);
                        }else{
                            res.redirect("/");
                            
                        }
                    })
                }
              
            })
        }

    })
        
    
    
   
})

app.put("/blogs/:id/:i/likes",isLoggedIn,function(req,res){
    req.body.like.name=req.user.username;
    Like.create(req.body.like,function(err,like){
        if(err){
            console.log(err);
        }else{
            Blog.findById(req.params.id,function(err,foundBlog){
                if(err){
                    console.log(err);
        
                }else{
                    
                    console.log(foundBlog.body[req.params.i]);
                    foundBlog.body[req.params.i].like+=1;
                    foundBlog.body[req.params.i].liked.push(like);
                    foundBlog.save();
                    
                    Blog.findByIdAndUpdate(req.params.id,foundBlog,function(err,blogs){
                        if(err){
                            console.log(err);
                        }else{
                            res.redirect("/blogs/"+req.params.id+"/view");
                            
                        }
                    })
                }
              
            })
        }

    })
})

app.put("/blogs/:id",isLoggedIn,function(req,res){
    req.body.ans.name=req.user.username;
    req.body.ans.like=0;
    Ans.create(req.body.ans,function(err,ans){
        if(err){
            console.log(err);
        }
        else{
            
            Blog.findById(req.params.id,function(err,foundBlog){
                if(err){
                    console.log(err);
                }
                else{
                    foundBlog.body.push(ans);
                    Blog.findByIdAndUpdate(req.params.id,foundBlog,function(err,blog){
                        if(err){
                            console.log(err);
                        }else{
                            res.redirect("/");
                        }

                        
                    })
                }
            })
            
           
            
        }
    })
    // Blog.findByIdAndUpdate(req.params.id,req.body.ans,function(err,UpdatedBlog){
    //     if(err){
    //         res.redirect("/blogs");
    //     }else{
    //         res.redirect("/blogs/"+req.params.id);
    //     }
    // })
})

//DELETE

app.get("/blogs/:id/view",isLoggedIn,function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log(err);
        }
        else{
            var count=0;
            for(var i=0;i<foundBlog.body.length;i++){
                if(foundBlog.body[i].ans!=""){
                    var count=count+1;
                }
            }
        
            res.render("view",{blog:foundBlog,currUser:req.user,count:count});
        }
    })
})

app.get("/blogs/:id/reply",isLoggedIn,function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log(err);
        }else{
            
            res.render("reply",{blog:foundBlog,currUser:req.user});
        }
    })
    
})

app.put("/blogs/:id/reply",isLoggedIn,function(req,res){

    req.body.reply.name=req.user.username;
    Reply.create(req.body.reply,function(err,foundReply){
        if(err){
            console.log(err);
        }else{
            
            Blog.findById(req.params.id,function(err,foundBlog){
                
                if(err){
                    console.log(err);
                }else{
                    foundBlog.body[0].reply.push(foundReply);
                    foundBlog.save();
                    Blog.findByIdAndUpdate(req.params.id,foundBlog,function(err,blog){
                        if(err){
                            console.log(err);
                        }else{
                            res.redirect("/");
                        }
                    })
                }

            })
        }
    })
})

app.get("/blogs/:id/:i/reply",isLoggedIn,function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log(err);
        }else{
            
            res.render("reply1",{blog:foundBlog,currUser:req.user,i:req.params.i});
        }
    })
    
})

app.put("/blogs/:id/:i/replys",function(req,res){

    req.body.reply.name=req.user.username;
    Reply.create(req.body.reply,function(err,foundReply){
        if(err){
            console.log(err);
        }else{
            console.log(foundReply);
            Blog.findById(req.params.id,function(err,foundBlog){
                
                if(err){
                    console.log(err);
                }else{
                    foundBlog.body[req.params.i].reply.push(foundReply);
                    foundBlog.save();
                    Blog.findByIdAndUpdate(req.params.id,foundBlog,function(err,blog){
                        if(err){
                            console.log(err);
                        }else{
                            res.redirect("/");
                        }
                    })
                }

            })
        }
    })
})

var PORT=process.env.PORT || 3000;
app.listen(PORT,function(){
    console.log("Server is running");
})