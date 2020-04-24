var bodyParser = require("body-parser"),
    express    = require("express"),
    mongoose   =require("mongoose"),
    app        = express(),
    expressSanitizer=require("express-sanitizer"),
    methodOverride=require("method-override");
    
    
    mongoose.connect("mongodb://localhost/restful_blog_app");
    app.set("view engine","ejs");
    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({extended:true}));
    //sanitizer after body-parser
    app.use(expressSanitizer());
    app.use(methodOverride("_method"));
   
   
   
    var blogSchema = new mongoose.Schema({
       title:String,
       image:String,
       body:String,
       created:{type:Date,default: Date.now}
    });
    var Blog=mongoose.model("Blog",blogSchema);
    // Blog.create({
    //     title:"Test blog",
    //     image:"https://images.unsplash.com/photo-1563299796-17596ed6b017?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    //     body:"This is a test blog"
        
    // });
    
    app.get("/",function(req, res) {
       res.redirect("/blogs"); 
    });
    
    app.get("/blogs",function(req,res){
      Blog.find({},function(err,blogs){
         if(err)
         console.log(err);
         else
           res.render("index",{blogs:blogs}); 
      });
     
    });
    app.get("/blogs/new",function(req, res) {
       res.render("new"); 
    });
    app.post("/blogs",function(req,res){
         var name = req.body.name;
         var image = req.body.image;
         var desc =req.sanitize(req.body.description);
         
         var newBlog = { title: name, image: image, body:desc };
       Blog.create(newBlog,function(err,newCreted){
           if(err){
           res.render("new");
           console.log("error")
               
           }
           else
           res.redirect("/blogs");
       });
    });
    app.get("/blogs/:id",function(req, res) {
        Blog.findById(req.params.id,function(err,foundBlog){
           if(err){
               res.redirect("/blogs");
           } 
           else
           res.render("show",{blog:foundBlog});
        });
    });
    app.get("/blogs/:id/edit",function(req, res) {
        Blog.findById(req.params.id,function(err,foundBlog){
           if(err){
               res.redirect("/blogs");
           } 
           else
           res.render("edit",{blog:foundBlog});
        });
    });
    app.put("/blogs/:id",function(req,res){
         var name = req.body.name;
         var image = req.body.image;
         var desc =req.sanitize(req.body.description);
         var updateBlog = { title: name, image: image, body:desc };
      Blog.findByIdAndUpdate(req.params.id,updateBlog,function(err,updatedBlog){
            if(err)
            res.redirect("/");
            else
            res.redirect("/blogs/"+req.params.id);
      });
    });
    
    app.delete("/blogs/:id",function(req,res){
       Blog.findByIdAndRemove(req.params.id,function(err){
           if(err)
           res.redirect("/blogs");
           else
           res.redirect("/blogs");
       }) ;
    });
    
    
    
    app.listen(process.env.PORT,process.env.IP,function(){
       console.log("Server is Running"); 
    });