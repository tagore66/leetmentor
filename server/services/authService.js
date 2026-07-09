const bcrypt = require("bcrypt");
const User = require("../models/User");

const registerUser = async (name, email, password) => {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
    }

    // Validate password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
        throw new Error("Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        provider: "local",
    });

    return user;
};

const loginUser = async (email, password) => {

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    return user;
};
const googleLogin = async (name, email, picture) => {
    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({
            name,
            email,
            profilePicture: picture || "",
            provider: "google",
        });
    }

    return user;
};
const githubLogin = async (name, email, picture) => {
    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({
            name,
            email,
            profilePicture: picture || "",
            provider: "github",
        });
    }

    return user;
};

module.exports = {
    registerUser,
    loginUser,
    googleLogin,
    githubLogin,
};