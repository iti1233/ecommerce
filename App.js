var express=require('express');
var app=express();
app.use(express.static("Ecommerce"));
app.use(express.static("Ecommerce/uploads"));
app.set("view engine","ejs");
var bd=require("body-parser");
var ed=bd.urlencoded({extended:false});
const multer = require('multer');
const session = require('express-session');
app.use(session({
  secret: '123#@$iti@#', // Replace with a strong, random key
  resave: true,
  saveUninitialized: true
}));

const st = multer.diskStorage({
  destination: function (req, file, cb) {

    cb(null, 'ecommerce/uploads/');
  },
  filename: function (req, file, cb) {
    
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: st });

var my =require('mysql');
const con=my.createConnection({
host:'127.0.0.1',
user:'root',
password:'',
database:'ecommerce'
});
con.connect(function(err)
{ 
if(err)throw err;
console.log("connect to mysql ")
})

app.use(function(req, res, next) {
  res.locals.aname = req.session.aname;
  res.locals.aemail= req.session.aemail;
res.locals.uname=req.session.uname;
res.locals	.uemail=req.session.uemail;
  next();
});

app.get("/",function(req,res)
{
res.redirect("index");
});
app.get("/index",function(req,res)
{
var a=req.query.search;
if(typeof(a)=="undefined")
var o="select * from product";
else
var o="select * from product where category='"+a+"'";
con.query(o,function(err,result)
{
res.render("index",{data:result});
});
});
app.get("/womens",function(req,res)
{
var at="select * from product where category='Women wear'";
con.query(at,function(err,result)
{

res.render("mens",{data:result});
});
});
app.get("/mens",function(req,res)
{
var t="select * from product where category='mens'";
con.query(t,function(err,result)
{

res.render("mens",{data:result});
});
});

app.get("/kids",function(req,res)
{
var at="select * from product where category='kids'";
con.query(at,function(err,result)
{
res.render("kids",{data:result});
});
});

app.get("/shop",function(req,res)
{
var nt="select * from product ";
con.query(nt,function(err,result)
{
res.render("shop",{data:result});
});
});


app.get("/contact",function(req,res)
{
res.render("contact");

});
app.get("/login",function(req,res)
{
res.sendFile("./Ecommerce/login.html",{root:__dirname});
});

app.get("/Register",function(req,res)
{
res.sendFile("./Ecommerce/Register.html",{root:__dirname});
});
app.get("/admin",function(req,res)
{
res.sendFile("./Ecommerce/admin.html",{root:__dirname});
});
app.post("/registeruser",ed,function(req,res)
{
var f=req.body.fn;
var l=req.body.ln;
var c=req.body.c;
var e=req.body.e;
var p=req.body.p;

var q="insert into register values ('"+f+"','"+l+"','"+c+"','"+e+"','"+p+"')";
con.query(q,function(err,request)
{
if(err)throw err; 
res.send("you are success register");
});
});
app.post("/contactuser",ed,(req,res)=>
{

var n=req.body.ff;
var em=req.body.ee;
var we=req.body.w;
var m=req.body.m;

var r="insert into contact values ('"+n+"','"+em+"','"+we+"','"+m+"')";
con.query(r,function(err,request)
{
if(err)throw err; 
res.send("you are successful send msg");
});

 });
app.post("/loginprocess",ed,function(req,res){
	var e = req.body.E1;
	var p = req.body.p1;
	
	var q = "select * from register where email='"+e+"'";
	con.query(q,function(err,result){
		if(err) throw err;
		
		var l = result.length;
		if(l>0) {
			if(result[0].password==p) {
req.session.uname =result[0].firstname;
req.session.uemail = result[0].email;
res.redirect("/");
			} else {
				res.send("invalid password");
			}
		} 
		else {
			res.send("incorrect email");
		}
	});
	}); 
app.post("/adminlogin",ed,(req,res)=>
{

var user=req.body.email;
var pass=req.body.password;
	
	var q = "select * from admin where email='"+user+"'";
	con.query(q,function(err,result){
		if(err) throw err;
		
		var l = result.length;
		if(l>0) {
			if(result[0].password==pass) {
				req.session.aname=result[0].username;
				req.session.aemail=result[0].email;
				res.render("dashboard");
			} else {
				res.send("invalid password");
			}
		} 
		else {
			res.send("incorrect email");
		}
	});

 });
app.get("/setting",function(req,res)
{
res.render("setting");
});
app.get("/vuser",function(req,res)
{
if(req.session.aemail==null)
res.redirect("admin");
else
{
var q="select *from register;";
con.query(q,function(err,result)
{ if(err)
throw err;
res.render("viewusers",{data:result});

});
}
});
app.get("/venquiry",function(req,res)

{
if(req.session.aemail==null)
res.redirect("admin");
else

{

var q="select *from contact;"
con.query(q,function(err,result)
{ if(err)
throw err;
res.render("viewenquiry",{data:result});

});
}
});

app.get("/deluser",function(req,res){
var e=req.query.em;
var q="delete from register where email='"+e+"'";
con.query(q,function(err,result)
{ 
res.redirect("vuser");
});
});

app.get("/delenquiry",function(req,res){
var s=req.query.em;
var q="delete from contact where email='"+s+"'";
con.query(q,function(err,result)
{ 
res.redirect("venquiry");
});
});
app.get("/aproduct",function(req,res)
{
if(req.session.aemail==null)
res.redirect("admin");
else
{
res.render("aproduct");
}
});
app.post("/productprocess",ed,upload.single('product_image'),(req,res)=>
{

var i=req.body.productid;
var pn=req.body.product_name;
var d=req.body.description;
var p=req.body.price;
var q=req.body.qty;
var c=req.body.category;
var pi=req.file.filename;
var z="insert into product values ('"+i+"','"+pn+"','"+d+"',"+p+","+q+",'"+c+"','"+pi+"')";
con.query(z,function(err,result)
{
if(err)throw err; 
res.redirect("/aproduct");
});
});
app.get("/vproduct",function(req,res)
{

if(req.session.aemail==null)
res.redirect("admin");
else
{

var k="select *from product ;"
con.query(k,function(err,result)
{ if(err)
throw err;
res.render("viewproduct",{data:result});

});
}
});
app.get("/delproduct",function(req,res){
var s=req.query.em;
var q="delete from product where id='"+s+"'";
con.query(q,function(err,result)
{ 
res.redirect("vproduct");
});
});
app.get("/alogout",function(req,res)
{
req.session.destroy((err) => {
  res.redirect('admin'); // will always fire after session is destroyed
})
});

app.post("/set",ed,(req,res)=>
{
if(req.session.aemail==null)
res.redirect("admin");
else
{
var em=req.session.aemail;
var we=req.body.op;
var m=req.body.np;
var d=req.body.cp;
var r="UPDATE  admin  SET  password = '"+m+"'  where  email = '"+em+"'";
con.query(r,function(err,request)
{
if(err)throw err; 
res.render("you are successful change password");
});
}
});
app.get("/dashboard",function(req,res)
{
res.render("dashboard");
});


app.get("/vcart",function(req,res)
{
if(req.session.uemail==null)
res.redirect("login");
else{
var e=req.session.uemail;
var q="select * from cart where email='"+e+"'";
con.query(q,function(err,result)
{
res.render("vcart",{data:result});
});
}
});
app.get("/delcart",function(req,res)
{
if(req.session.uemail==null)
res.redirect("login") ;
else{
var n=req.session.uemail;
var pidd=req.query.pid;
var q="delete from cart where email='"+n+"' and product_id='"+pidd+"'";
con.query(q,function(err,result)
{
res.redirect("vcart");
});
}
});
app.get("/checkout",function(req,res)
{
if(req.session.uemail==null)
res.redirect("login");
else{
var e=req.session.uemail;
var q="select product_name,price from cart where email='"+e+"'";
con.query(q,function(err,result)
{
console.log(result);
res.render("checkout",{data:result});
});
}
});
app.post("/orderprocess",ed,function(req,res)
{
if(req.session.uemail==null)
res.redirect("login");
else
{
var fn=req.body.fn;
var ln=req.body.ln;
var e=req.session.uemail;
var c=req.body.c;
var a=req.body.a;
var ci=req.body.tc;
var s=req.body.s;
var p=req.body.po;
var ph=req.body.ph;
var qt= "select product_name,price,image from cart where email='"+e+"'";
var pn="";
var pr=0;
var img="";
con.query(qt,function(err,result)
{
for(i=0;i<result.length;i++)
{
pn=pn+result[i].product_name+",";
pr=pr+result[i].price;
img=img+result[i].image+",";
}
var q="insert into orders(fname,lastname,email,country,address,city,state,pincode,phone,pname,amount,image) values ('"+fn+"','"+ln+"','"+e+"','"+c+"','"+a+"','"+ci+"','"+s+"',"+p+",'"+ph+"','"+pn+"',"+pr+",'"+img+"')";
con.query(q,function(err,result)
{
if(err) throw err;

var qtt="delete from cart where email='"+e+"'";
con.query(qtt,function(err,result)
{
res.sendFile("./ecommerce/final.html",{root:__dirname});
});
});
});
}
});
app.get("/addcart",function(req,res)
{
if(req.session.uemail ==null)
res.redirect("login");
else
{
var pid = req.query.pid;
var pname = req.query.pname;
var pcat = req.query.pcat;
var price = req.query.price;
var pq = parseInt(req.query.qty) || 1;
var img = req.query.img;
var un = req.session.uname;
var em = req.session.uemail;
var qt="select * from cart where email='"+em+"' and product_id='"+pid+"'";
con.query(qt,function(err,result)
{
var L=result.length;
if(L>0)
res.send("Product present in Cart");
else
{
var l ="insert into cart values ('"+un+"','"+em+"','"+pid+"','"+pcat+"',"+price+",'"+img+"','"+pname+"',"+pq+")";

con.query(l,function(err,result)
{
if(err)throw err; 
res.redirect("vcart");
});

}

});
}
});
app.get("/updateqty", function(req,res)
{
    var pid = req.query.pid;
    var qty = parseInt(req.query.qty) || 1;
    var email = req.session.uemail;

    var q = "update cart set qty="+qty+
            " where product_id='"+pid+
            "' and email='"+email+"'";

    con.query(q,function(err,result)
    {
        if(err) throw err;
        res.send("updated");
    });
});

app.get("/vorders",function(req,res)
{

if(req.session.aemail==null)
res.redirect("admin");
else
{

var k="select *from orders;"
con.query(k,function(err,result)
{ if(err)
throw err;
res.render("vorder",{data:result});

});
}
});

app.get("/userorder",function(req,res)
{

if(req.session.uemail==null)
res.redirect("login");
else
{
var e=req.session.uemail;
var k="select *from orders where email='"+e+"'"
con.query(k,function(err,result)
{ if(err)
throw err;
res.render("userorder",{data:result});

});
}
});
app.get("/cancelorder",function(req,res)
{
if(req.session.uemail==null)
res.redirect("login") ;
else{
var n=req.session.uemail;
var pidd=req.query.orderid;
var q="delete from orders where email='"+n+"' and oid='"+pidd+"'";
con.query(q,function(err,result)
{
res.redirect("userorder");


});
}
});


app.listen(4000);
