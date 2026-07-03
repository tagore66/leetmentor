const { registerUser, loginUser } = require("../services/authService");
const generateToken = require("../utils/generateToken");

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

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                provider: user.provider,
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
module.exports = {
    register,
    login,
    profile,
};