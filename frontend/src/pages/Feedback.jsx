import { useState } from 'react';
import api from '../api/axios';
import { MessageSquare, Star, Send } from 'lucide-react';

const Feedback = () => {
    const [message, setMessage] = useState('');
    const [rating, setRating] = useState(5);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/feedback', { message, rating });
            setSubmitted(true);
        } catch (err) {
            console.error("Feedback error:", err);
            alert("Error submitting feedback. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>
                <div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto', padding: '4rem' }}>
                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                        <Send size={40} />
                    </div>
                    <h2>Thank You!</h2>
                    <p className="text-muted" style={{ marginTop: '1rem' }}>Your feedback has been submitted successfully. We appreciate your input!</p>
                    <button className="btn btn-primary" style={{ marginTop: '2rem' }} onClick={() => setSubmitted(false)}>Submit Another</button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <MessageSquare size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                <h2 className="page-title">We Value Your Feedback</h2>
                <p className="page-subtitle">Help us improve Cortexa by sharing your thoughts or reporting issues.</p>
            </div>

            <div className="glass-panel">
                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label className="form-label">How would you rate your experience?</label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    style={{ 
                                        background: 'none', 
                                        border: 'none', 
                                        cursor: 'pointer',
                                        color: star <= rating ? '#fbbf24' : 'var(--text-muted)',
                                        transition: 'transform 0.1s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <Star size={32} fill={star <= rating ? 'currentColor' : 'none'} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Your Message</label>
                        <textarea
                            className="form-input"
                            rows="6"
                            placeholder="Tell us what you liked, what can be improved, or reports any bugs..."
                            required
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Feedback;
