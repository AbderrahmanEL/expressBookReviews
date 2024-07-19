const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

const JWT_SECRET = "1889c985aec82754070cabf8f8b5e66ddd60599ffd0b03d3ef8e8202c6d94471"

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){

    const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Extract JWT token
    try {
      // Verify the JWT token
      const decoded = jwt.verify(token, JWT_SECRET);
      // Attach user information to request object
      req.user = decoded;
      next(); // Move to the next middleware or route handler
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  } else {
    return res.status(401).json({ message: 'Authorization header not found' });
  }

});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
