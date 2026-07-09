const { registerUser, loginUser, googleLogin, githubLogin } = require("../services/authService");
const generateToken = require("../utils/generateToken");
const axios = require("axios");
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

const githubAuth = (req, res) => {
    const { source, id } = req.query;
    
    const redirectUri = process.env.NODE_ENV === 'production' 
        ? 'https://leetmentor-ltjj.onrender.com/api/auth/github/callback' 
        : 'http://localhost:5000/api/auth/github/callback';
    
    // Pass source and id in state parameter
    const state = source === 'extension' && id ? `extension_${id}` : 'web';
    
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email&state=${state}`;
    res.redirect(githubAuthUrl);
};

const githubCallback = async (req, res) => {
    const { code, state } = req.query;
    let frontendUrl = process.env.NODE_ENV === 'production' ? 'https://leetmentor-one.vercel.app' : 'http://localhost:5173';

    if (!code) {
        return res.redirect(`${frontendUrl}/login?error=no_code`);
    }
    
    try {
        const tokenRes = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
        }, {
            headers: { Accept: 'application/json' }
        });
        
        const accessToken = tokenRes.data.access_token;
        if (!accessToken) {
             return res.redirect(`${frontendUrl}/login?error=github_token_failed`);
        }

        const userRes = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        
        const emailRes = await axios.get('https://api.github.com/user/emails', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        
        const primaryEmailObj = emailRes.data.find(e => e.primary) || emailRes.data[0];
        const email = primaryEmailObj ? primaryEmailObj.email : null;
        
        if (!email) {
             return res.redirect(`${frontendUrl}/login?error=no_email`);
        }

        const { name, avatar_url, login: username } = userRes.data;
        const displayName = name || username;

        const user = await githubLogin(displayName, email, avatar_url);
        const jwtToken = generateToken(user._id);

        if (state && state.startsWith('extension_')) {
            const extId = state.split('_')[1];
            return res.redirect(`https://${extId}.chromiumapp.org/?token=${jwtToken}`);
        }

        res.redirect(`${frontendUrl}/login?token=${jwtToken}`);
        
    } catch (err) {
        console.error("GitHub Auth Error:", err.response?.data || err.message);
        res.redirect(`${frontendUrl}/login?error=github_auth_failed`);
    }
};

module.exports = {
    register,
    login,
    profile,
    googleAuth,
    githubAuth,
    githubCallback,
};