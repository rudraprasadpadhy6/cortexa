const Note = require('../models/Note');
const { OpenAI } = require('openai');
const pdfParse = require('pdf-parse');

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

exports.generateNote = async (req, res) => {
    try {
        let contentToProcess = req.body.text || "";

        // If file is uploaded, parse it
        if (req.file) {
            const pdfData = await pdfParse(req.file.buffer);
            contentToProcess += "\n" + pdfData.text;
        }

        if (!contentToProcess) {
            return res.status(400).json({ message: "No content provided." });
        }

        const type = req.body.type || "detailed";
        
        let systemPrompt = "You are a smart study assistant. Generate professional study notes. ";
        systemPrompt += "Respond ONLY with a JSON object containing two fields: 'title' (a short, catchy title based on the content keywords, maximum 5-6 words) and 'content' (the summarized notes in Markdown HTML). ";
        
        if (type === "short") {
            systemPrompt += "The content should be summarized into short, structured notes with headings and very brief key concepts.";
        } else {
            systemPrompt += "The content should be summarized into detailed, structured notes with headings, comprehensive bullet points, and an explanation of key concepts.";
        }

        let generatedNotes = "";
        let generatedTitle = "";

        try {
            const response = await openai.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: contentToProcess.substring(0, 15000) } 
                ],
                response_format: { type: "json_object" }
            });
            
            const aiResponse = JSON.parse(response.choices[0].message.content);
            generatedNotes = aiResponse.content;
            generatedTitle = aiResponse.title;
        } catch (aiErr) {
            console.error("AI Error:", aiErr);
            if (aiErr.status === 401 || aiErr.status === 429 || aiErr.code === 'invalid_api_key' || aiErr.code === 'insufficient_quota' || aiErr instanceof SyntaxError) {
                console.log("Mocking Note Output due to AI API issue or parse error...");
                const sentences = contentToProcess.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 10);
                
                generatedTitle = req.body.title || "Study Session Notes";
                generatedNotes = `
# Offline Mode: Notes summary
*No valid Groq/AI API key was found or the quota is exhausted. Generating offline summary...*

## Key Extracts from Input
`;
                const limit = Math.min(5, sentences.length);
                for (let i = 0; i < limit; i++) {
                    generatedNotes += `- **Point ${i+1}**: ${sentences[i]}\n`;
                }
                
                if (sentences.length === 0) {
                     generatedNotes += "- *No readable text was found in the input to summarize.*";
                }
            } else {
                throw aiErr;
            }
        }

        const newNote = new Note({
            userId: req.user.id,
            title: generatedTitle || req.body.title || "Untitled Notes",
            content: generatedNotes,
            type
        });

        await newNote.save();

        res.status(201).json({ note: newNote });
    } catch (error) {
        console.error("Notes Error:", error);
        res.status(500).json({ message: "Error generating notes", error: error.message });
    }
};

exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notes" });
    }
};

exports.getNoteById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Note not found" });
        if (note.userId.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });
        
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: "Error fetching note" });
    }
};

exports.toggleBookmarkNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Note not found" });
        if (note.userId.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

        note.isBookmarked = !note.isBookmarked;
        await note.save();
        res.json({ message: "Bookmark toggled", isBookmarked: note.isBookmarked });
    } catch (error) {
        res.status(500).json({ message: "Error toggling bookmark" });
    }
};
