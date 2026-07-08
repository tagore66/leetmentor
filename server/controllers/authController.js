const { registerUser, loginUser, googleLogin } = require("../services/authService");
const generateToken = require("../utils/generateToken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const register = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const user = await registerUser(name, email, password);

        res.status(201).json({
            success: true,
            user,
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message,
        });

    }

};
const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await loginUser(email, password);

        const token = generateToken(user._id);

        res.cookie("leetai_token", token, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: false,
        });

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                provider: user.provider,
                settings: user.settings,
                usage: user.usage,
            },
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message,
        });

    }

};
const profile = async (req, res) => {
    res.json({
        success: true,
        user: req.user,
    });
};
const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ success: false, message: "Token is required" });
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { name, email, picture } = payload;

        const user = await googleLogin(name, email, picture);
        const jwtToken = generateToken(user._id);

        res.cookie("leetai_token", jwtToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: false,
        });

        res.json({
            success: true,
            token: jwtToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                provider: user.provider,
                profilePicture: user.profilePicture,
                settings: user.settings,
                usage: user.usage,
            },
        });
    } catch (err) {
        res.status(400).json({ success: false, message: "Google Authentication failed" });
    }
};

module.exports = {
    register,
    login,
    profile,
    googleAuth,
};