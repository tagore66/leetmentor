const axios = require("axios");
const Conversation = require("../models/Conversation");
const { saveMessage } = require("./messageController");

const askAI = async (req, res) => {
    try {
        const { prompt, conversationId, model, mode, attachments } = req.body;
        const MODELS = require("../config/models");

        // Validate the requested model against the backend configuration
        let selectedModel = "deepseek/deepseek-chat"; // fallback default
        const requestedModel = MODELS.find(m => m.id === model && m.enabled);
        if (requestedModel) {
            selectedModel = requestedModel.id;
        }
        let previousMessages = [];
        if (conversationId) {
            const Message = require("../models/Message");
            const messages = await Message.find({ conversation: conversationId }).sort({ createdAt: 1 }).limit(10);
            previousMessages = messages.map(msg => {
                let content = msg.content;
                const images = msg.attachments?.filter(a => a.type === "image") || [];
                if (images.length > 0) {
                    content = [{ type: "text", text: msg.content }];
                    images.forEach(img => {
                        content.push({ type: "image_url", image_url: { url: img.data } });
                    });
                }
                return {
                    role: msg.role,
                    content
                };
            });
        }

        let basePrompt = `You are an elite Staff Software Engineer acting as a Pair Programmer for a user on LeetCode. 
You are NOT a ChatGPT-style assistant. You are a mentor sitting beside the user.

CRITICAL RULES:
1. PROGRESSIVE DISCLOSURE: NEVER immediately reveal the full algorithm or code. If the user says "hi" or asks a general question, ALWAYS ask how they want to proceed. (e.g. "Nice start. Would you like a small hint, or should we discuss the overall approach?")
2. CONVERSATIONAL & HUMAN TONE: Speak naturally, concisely, and supportively. Use phrases like:
   - "Interesting approach."
   - "Why do you think that would work here?"
   - "I think you're very close."
   - "I noticed something interesting in your logic."
3. SOCRATIC TEACHING: Do not just give answers. Ask questions that lead the user to the answer.
4. RESPECT CONTEXT: You know their language and problem. Don't ask them what they are solving. Say "I noticed you're solving [Problem] in [Language]."
5. NEVER REVEAL CODE AUTOMATICALLY: Only output code if the user explicitly begs for it or has exhausted all hints.
6. FORMATTING: Use Markdown, bullet points, and bold text. Keep responses extremely concise. Never write walls of text.`;

        let systemPrompt = basePrompt;
        switch (mode) {
            case "Hint": 
                systemPrompt = `${basePrompt}\n\nMODE: Hint.\n- Give ONLY ONE tiny hint.\n- NEVER reveal the algorithm or code.\n- Example: "Think about what information you already know before processing each index."\n- End by asking if they want another hint or if they want to try it.`; 
                break;
            case "Debug": 
                systemPrompt = `${basePrompt}\n\nMODE: Debug.\n- IGNORE the problem explanation.\n- Focus ONLY on the user's provided code.\n- Point out bugs, incorrect logic, runtime issues, or edge cases.\n- NEVER rewrite their entire solution. Give them the specific line and ask why it might fail.`; 
                break;
            case "Explain": 
                systemPrompt = `${basePrompt}\n\nMODE: Explain.\n- Teach the concept behind the optimal solution.\n- Explain visually and focus on intuition.\n- Explain WHY, not just WHAT.\n- ABSOLUTELY NO code or pseudocode unless explicitly asked.`; 
                break;
            case "Complexity": 
                systemPrompt = `${basePrompt}\n\nMODE: Complexity.\n- ONLY discuss Time Complexity and Space Complexity.\n- Discuss better alternatives if they exist.\n- Keep it strictly analytical.`; 
                break;
            default: 
                systemPrompt = `${basePrompt}\n\nMODE: Mentor.\n- Act like a senior engineer.\n- Never immediately give code.\n- Keep asking Socratic questions (e.g. "What is your current idea?", "Why would two pointers work here?").`;
        }

        const textAtts = attachments?.filter(a => a.type === "file" || a.type === "code") || [];
        let finalPrompt = prompt;
        if (textAtts.length > 0) {
            finalPrompt += "\n\n--- Attached Context ---\n";
            textAtts.forEach(att => {
                finalPrompt += `\n**${att.name || "Attachment"}**:\n\`\`\`\n${att.data}\n\`\`\`\n`;
            });
        }

        const imageAtts = attachments?.filter(a => a.type === "image") || [];
        let userContent = finalPrompt;
        if (imageAtts.length > 0) {
            userContent = [{ type: "text", text: finalPrompt }];
            imageAtts.forEach(img => {
                userContent.push({ type: "image_url", image_url: { url: img.data } });
            });
        }

        const openRouterMessages = [
            { role: "system", content: systemPrompt },
            ...previousMessages,
            { role: "user", content: userContent }
        ];

        let apiUrl = "https://openrouter.ai/api/v1/chat/completions";
        let apiToken = process.env.OPENROUTER_API_KEY;
        let requestModel = selectedModel;

        if (selectedModel === "google/gemini-pro-1.5") {
            apiUrl = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
            apiToken = process.env.GEMINI_API_KEY;
            requestModel = "gemini-flash-latest";
        }

        const response = await axios({
            method: 'post',
            url: apiUrl,
            data: {
                model: requestModel,
                messages: openRouterMessages,
                max_tokens: 1500,
                stream: req.body.stream === true
            },
            headers: {
                Authorization: `Bearer ${apiToken}`,
                "Content-Type": "application/json",
            },
            responseType: req.body.stream ? 'stream' : 'json'
        });

        let conversation;
        if (conversationId) {
            conversation = await Conversation.findById(conversationId);
        } else {
            conversation = await Conversation.create({
                user: req.user.id,
                title: prompt.substring(0, 30) + (prompt.length > 30 ? "..." : ""),
            });
            
            const User = require("../models/User");
            await User.findByIdAndUpdate(req.user.id, { $inc: { "usage.totalConversations": 1 } });

        // Asynchronously generate a smart title in the background
        axios.post("https://openrouter.ai/api/v1/chat/completions", {
            model: "deepseek/deepseek-chat",
            messages: [{ role: "user", content: `Generate a very short 3 to 4 word descriptive title for this prompt. Do not use quotes, punctuation, or generic greetings: ${prompt}` }]
            }, {
                headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` }
            }).then(titleRes => {
                const generatedTitle = titleRes.data.choices[0].message.content.replace(/["']/g, '').trim();
                Conversation.findByIdAndUpdate(conversation._id, { title: generatedTitle }).exec();
            }).catch(e => console.error("Title generation failed:", e.message));
        }

        await saveMessage(
            conversation._id,
            "user",
            prompt,
            attachments || []
        );

        if (req.body.stream) {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            
            // Send conversation ID first
            res.write(`data: ${JSON.stringify({ type: 'meta', conversationId: conversation._id })}\n\n`);

            let fullContent = "";
            response.data.on('data', (chunk) => {
                const chunkStr = chunk.toString();
                res.write(chunkStr);
                
                const lines = chunkStr.split('\n');
                for (let line of lines) {
                    if (line.startsWith('data: ') && line.trim() !== 'data: [DONE]') {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content) {
                                fullContent += data.choices[0].delta.content;
                            }
                        } catch (e) {}
                    }
                }
            });
            
            response.data.on('end', async () => {
                await saveMessage(conversation._id, "assistant", fullContent);
                const User = require("../models/User");
                let incQuery = {
                    "usage.totalRequests": 1,
                    "usage.todayRequests": 1,
                    "usage.totalMessages": 2
                };
                if (mode === "Debug") incQuery["usage.debugSessions"] = 1;
                else if (mode === "Interview") incQuery["usage.mockInterviews"] = 1;
                else incQuery["usage.problemsDiscussed"] = 1;
                
                await User.findByIdAndUpdate(req.user.id, { $inc: incQuery });
                res.end();
            });
            
            response.data.on('error', (err) => {
                res.end();
            });
            return;
        }

        await saveMessage(
            conversation._id,
            "assistant",
            response.data.choices[0].message.content
        );

        const User = require("../models/User");
        let incQuery = {
            "usage.totalRequests": 1,
            "usage.todayRequests": 1,
            "usage.totalMessages": 2
        };
        if (mode === "Debug") incQuery["usage.debugSessions"] = 1;
        else if (mode === "Interview") incQuery["usage.mockInterviews"] = 1;
        else incQuery["usage.problemsDiscussed"] = 1;
        
        await User.findByIdAndUpdate(req.user.id, { $inc: incQuery });

        res.json({
            success: true,
            conversationId: conversation._id,
            reply: response.data.choices[0].message.content,
        });

    } catch (err) {
        console.log(err.response?.data || err);
        res.status(500).json({
            success: false,
            message: err.response?.data?.error?.message || "AI Error",
        });
    }
};

module.exports = {
    askAI,
};