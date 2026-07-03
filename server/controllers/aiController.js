const axios = require("axios");

const askAI = async (req, res) => {
    try {
        const { prompt } = req.body;

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "deepseek/deepseek-chat-v3-0324",
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],max_tokens: 500
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        res.json({
            success: true,
            reply: response.data.choices[0].message.content,
        });

    } catch (err) {
        console.log(err.response?.data || err.message);

        res.status(500).json({
            success: false,
            message: "AI Error",
        });
    }
};

module.exports = {
    askAI,
};