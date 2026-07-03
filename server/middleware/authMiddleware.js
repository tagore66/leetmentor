const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            console.log("TOKEN:", token);
            console.log("VERIFY SECRET:", process.env.JWT_SECRET);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            console.log("DECODED:", decoded);

            req.user = await User.findById(decoded.id).select("-password");

            console.log("USER:", req.user);

            next();

        } catch (err) {
            console.log(err);

            return res.status(401).json({
                success: false,
                message: "Not authorized",
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No token provided",
        });
    }
};

module.exports = protect;