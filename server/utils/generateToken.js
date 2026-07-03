const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
    console.log("SIGNING SECRET:", process.env.JWT_SECRET);
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

module.exports = generateToken;