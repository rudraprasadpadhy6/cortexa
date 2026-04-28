const Quiz = require('../models/Quiz');
const User = require('../models/User');
const { OpenAI } = require('openai');
const pdfParse = require('pdf-parse');
const apiKey = process.env.GROQ_API_KEY;

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

exports.generateQuiz = async (req, res) => {
    try {
        let contentToProcess = req.body.text || "";

        if (req.file) {
            const pdfData = await pdfParse(req.file.buffer);
            contentToProcess += "\n" + pdfData.text;
        }

        if (!contentToProcess) {
            return res.status(400).json({ message: "No content provided." });
        }

        const difficulty = req.body.difficulty || "medium";
        let difficultyInstructions = "conceptual";
        if (difficulty === "easy") difficultyInstructions = "definition-based and straightforward";
        if (difficulty === "hard") difficultyInstructions = "analytical and scenario-based";

        const prompt = `Generate exactly 5 multiple choice questions based on the following text. The difficulty should be ${difficulty} (${difficultyInstructions}).
Return ONLY a JSON object. The object must have these exactly 2 keys:
- "topic": A short, catchy name for this quiz based on the text keywords (max 5 words)
- "questions": An array of 5 objects, each having "questionText", "options" (array of 4 strings), and "correctAnswer" (string).

Text to base questions on:
${contentToProcess.substring(0, 15000)}`;

        let questionsObj;
        let generatedTopic = "";

        try {
            const response = await openai.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
            });
            const aiMessage = response.choices[0].message.content;

            try {
                questionsObj = JSON.parse(aiMessage);
                generatedTopic = questionsObj.topic;
            } catch (e) {
                const jsonStr = aiMessage.substring(aiMessage.indexOf('{'), aiMessage.lastIndexOf('}') + 1);
                questionsObj = JSON.parse(jsonStr);
                generatedTopic = questionsObj.topic;
            }
        } catch (aiErr) {
            if (aiErr.status === 401 || aiErr.status === 429 || aiErr.code === 'insufficient_quota') {
                console.log("Mocking Quiz Output since AI key is invalid or lacks quota.");
                generatedTopic = req.body.topic || "General Knowledge Quiz";
                questionsObj = {
                    questions: [
                        { questionText: "What is the capital of France? (Mock Question)", options: ["Berlin", "London", "Paris", "Madrid"], correctAnswer: "Paris" },
                        { questionText: "What does HTML stand for? (Mock Question)", options: ["Hyper Text Preprocessor", "Hyper Text Markup Language", "Hyper Tool Multi Language", "Hyperlinks and Text Markup Language"], correctAnswer: "Hyper Text Markup Language" },
                        { questionText: "Which language is used for styling web pages? (Mock Question)", options: ["HTML", "JQuery", "CSS", "XML"], correctAnswer: "CSS" },
                        { questionText: "Who is making Web standards? (Mock Question)", options: ["Mozilla", "Microsoft", "The World Wide Web Consortium", "Google"], correctAnswer: "The World Wide Web Consortium" },
                        { questionText: "Choose the correct HTML element for the largest heading: (Mock Question)", options: ["<heading>", "<h6>", "<head>", "<h1>"], correctAnswer: "<h1>" }
                    ]
                };
            } else {
                throw aiErr;
            }
        }

        const questionsArray = questionsObj.questions || (Array.isArray(questionsObj) ? questionsObj : []);

        if (questionsArray.length === 0) {
            return res.status(500).json({ message: "Failed to generate valid quiz questions." });
        }

        const newQuiz = new Quiz({
            userId: req.user.id,
            topic: generatedTopic || req.body.topic || "Generated Quiz",
            difficulty,
            questions: questionsArray,
            totalQuestions: questionsArray.length
        });

        await newQuiz.save();

        res.status(201).json({ quiz: newQuiz });
    } catch (error) {
        console.error("Quiz Error:", error);
        res.status(500).json({ message: "Error generating quiz", error: error.message });
    }
};

exports.getQuizHistory = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching quizzes" });
    }
};

exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });
        if (quiz.userId.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: "Error fetching quiz" });
    }
};

exports.submitQuizResult = async (req, res) => {
    try {
        const { score } = req.body;
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) return res.status(404).json({ message: "Quiz not found" });
        if (quiz.userId.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

        quiz.score = score;
        await quiz.save();

        // Badge Award Logic
        const user = await User.findById(req.user.id);
        const percentage = (score / quiz.totalQuestions) * 100;
        let newBadges = [];

        if (percentage >= 80 && !user.badges.includes('Scholar')) {
            user.badges.push('Scholar');
            newBadges.push('Scholar');
        }
        if (percentage === 100 && !user.badges.includes('Master')) {
            user.badges.push('Master');
            newBadges.push('Master');
        }

        if (newBadges.length > 0) {
            await user.save();
        }

        res.json({
            message: "Score updated",
            quiz,
            newBadges,
            user: { username: user.username, email: user.email, badges: user.badges }
        });
    } catch (error) {
        console.error("Submit Quiz Error:", error);
        res.status(500).json({ message: "Error updating score" });
    }
};

exports.toggleBookmarkQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });
        if (quiz.userId.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

        quiz.isBookmarked = !quiz.isBookmarked;
        await quiz.save();
        res.json({ message: "Bookmark toggled", isBookmarked: quiz.isBookmarked });
    } catch (error) {
        res.status(500).json({ message: "Error toggling bookmark" });
    }
};
