import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { FileText, Type } from 'lucide-react';
import { ContentContext } from '../context/ContentContext';

const Upload = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { sharedText, setSharedText } = useContext(ContentContext);
    
    const [inputType, setInputType] = useState('text'); // text or file
    const [textInput, setTextInput] = useState(sharedText);
    const [fileInput, setFileInput] = useState(null);
    const [generationType, setGenerationType] = useState('notes'); // notes or quiz
    const [loading, setLoading] = useState(false);
    
    // Notes options
    const [notesType, setNotesType] = useState('detailed');
    // Quiz options
    const [quizDifficulty, setQuizDifficulty] = useState('medium');

    useEffect(() => {
        if (location.state?.type) {
            setGenerationType(location.state.type);
        }
        if (location.state?.topic) {
            setTextInput(location.state.topic);
        }
    }, [location.state]);

    useEffect(() => {
        setSharedText(textInput);
    }, [textInput, setSharedText]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        
        if (inputType === 'text') {
            formData.append('text', textInput);
        } else if (inputType === 'file' && fileInput) {
            formData.append('document', fileInput);
        }

        try {
            if (generationType === 'notes') {
                formData.append('type', notesType);
                const res = await api.post('/notes/generate', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                navigate(`/notes/${res.data.note._id}`);
            } else {
                formData.append('difficulty', quizDifficulty);
                const res = await api.post('/quiz/generate', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                navigate(`/quiz/${res.data.quiz._id}`);
            }
        } catch (error) {
            console.error("Generation error:", error);
            alert("Error generating content. Please check console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 className="page-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                {generationType === 'notes' ? 'Generate Study Notes' : 'Generate Practice Quiz'}
            </h2>
            
            <div className="glass-panel">
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <button 
                            type="button"
                            className={`btn ${inputType === 'text' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setInputType('text')}
                            style={{ flex: 1 }}
                        >
                            <Type size={18} /> Paste Text
                        </button>
                        <button 
                            type="button"
                            className={`btn ${inputType === 'file' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setInputType('file')}
                            style={{ flex: 1 }}
                        >
                            <FileText size={18} /> Upload PDF
                        </button>
                    </div>

                    {inputType === 'text' ? (
                        <div className="form-group">
                            <label className="form-label">Study Material Text</label>
                            <textarea 
                                className="form-input" 
                                rows="8" 
                                required
                                placeholder="Paste your text here..."
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                            ></textarea>
                        </div>
                    ) : (
                        <div className="form-group border-dashed border-2 border-gray-600 rounded" style={{ padding: '2rem', textAlign: 'center', borderStyle: 'dashed', borderWidth: '2px', borderColor: 'var(--glass-border)' }}>
                            <input 
                                type="file" 
                                accept=".pdf" 
                                required
                                onChange={(e) => setFileInput(e.target.files[0])}
                                style={{ color: 'var(--text-main)' }}
                            />
                        </div>
                    )}

                    {generationType === 'notes' ? (
                        <div className="form-group">
                            <label className="form-label">Notes Detail Level</label>
                            <select className="form-input" value={notesType} onChange={(e) => setNotesType(e.target.value)}>
                                <option value="short">Short Summary</option>
                                <option value="detailed">Detailed Notes (Bullet Points)</option>
                            </select>
                        </div>
                    ) : (
                        <div className="form-group">
                            <label className="form-label">Quiz Difficulty</label>
                            <select className="form-input" value={quizDifficulty} onChange={(e) => setQuizDifficulty(e.target.value)}>
                                <option value="easy">Easy (Definitions)</option>
                                <option value="medium">Medium (Conceptual)</option>
                                <option value="hard">Hard (Analytical)</option>
                            </select>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'Generating Output with AI...' : `Generate ${generationType === 'notes' ? 'Notes' : 'Quiz'}`}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Upload;
