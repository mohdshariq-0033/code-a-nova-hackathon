const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Token extract karo
      token = req.headers.authorization.split(' ')[1];
      // console.log("-> Backend received token successfully.");

      // 2. Token verify karo (JWT_SECRET check karo ki login wale se match ho raha hai ya nahi)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("-> Token decoded successfully. User ID:", decoded.userId || decoded.id);

      // 3. User ko req me attach karo
      req.user = decoded; 
      
      next();
    } catch (error) {
      console.error("-> JWT Verification Failed Error:", error.message);
      return res.status(401).json({ message: 'Not authorized, token failed: ' + error.message });
    }
  }

  if (!token) {
    console.log("-> No Authorization header or Bearer token found.");
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = protect; // ya { protect } jo bhi aapne export kiya ho