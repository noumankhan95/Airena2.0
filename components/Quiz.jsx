"use client";
import React, { useState, useEffect } from 'react';
import { Trash, Edit3 } from 'lucide-react';
import { db } from '@/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, onSnapshot, updateDoc } from 'firebase/firestore';
import { TextField, Button, Typography, Box, Paper, Checkbox, FormControlLabel, IconButton, Stack } from '@mui/material';
import { green, blue, red, purple, yellow } from '@mui/material/colors';

const Quiz = ({ playbackId, streamId }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [options, setOptions] = useState(['']);
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [showQuizForm, setShowQuizForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [previewQuiz, setPreviewQuiz] = useState(null);
    const [currentQuiz, setCurrentQuiz] = useState({
        questions: [],
        streamId: '',
        active: true,
        createdAt: null
    });

    // Fetch quizzes for this stream
    useEffect(() => {
        if (!playbackId) return;

        const quizRef = collection(db, 'quizzes');
        const q = query(quizRef, where('playbackId', '==', playbackId));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const quizData = [];
            snapshot.forEach((doc) => {
                quizData.push({ ...doc.data(), id: doc.id });
            });
            // Find the active quiz for this stream
            const activeQuiz = quizData.find(quiz => quiz.active);
            if (activeQuiz) {
                setCurrentQuiz(activeQuiz);
                setQuestions(activeQuiz.questions || []);
            } else {
                setCurrentQuiz({
                    questions: [],
                    streamId,
                    active: true,
                    createdAt: null
                });
                setQuestions([]);
            }
        });

        return () => unsubscribe();
    }, [playbackId]);

    const addOption = () => {
        setOptions([...options, '']);
    };

    const removeOption = (index) => {
        setOptions(options.filter((_, i) => i !== index));
        setCorrectAnswers(correctAnswers.filter((_, i) => i !== index));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const toggleCorrectAnswer = (index) => {
        if (correctAnswers.includes(index)) {
            setCorrectAnswers(correctAnswers.filter((i) => i !== index));
        } else {
            setCorrectAnswers([...correctAnswers, index]);
        }
    };

    const addQuestion = () => {
        if (currentQuestion.trim() === '') {
            alert('Question cannot be empty');
            return;
        }
        if (options.some(option => option.trim() === '')) {
            alert('Options cannot be empty');
            return;
        }
        if (correctAnswers.length === 0) {
            alert('At least one correct option must be selected');
            return;
        }
        const newQuestion = { question: currentQuestion, options, correctAnswers };
        const updatedQuestions = [...questions, newQuestion];
        setQuestions(updatedQuestions);
        setCurrentQuiz(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
        setCurrentQuestion('');
        setOptions(['']);
        setCorrectAnswers([]);
    };

    const editQuestion = (index) => {
        const questionToEdit = questions[index];
        setCurrentQuestion(questionToEdit.question);
        setOptions(questionToEdit.options);
        setCorrectAnswers(questionToEdit.correctAnswers);
        setIsEditing(true);
        setEditIndex(index);
        setShowQuizForm(true);
    };

    const updateQuestion = () => {
        const updatedQuestion = { question: currentQuestion, options, correctAnswers };
        const updatedQuestions = [...questions];
        updatedQuestions[editIndex] = updatedQuestion;
        setQuestions(updatedQuestions);
        setCurrentQuiz(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
        setIsEditing(false);
        setEditIndex(null);
        setCurrentQuestion('');
        setOptions(['']);
        setCorrectAnswers([]);
    };

    const removeQuestion = async (index) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        setQuestions(updatedQuestions);
        setCurrentQuiz(prev => ({
            ...prev,
            questions: updatedQuestions
        }));

        // If this quiz exists in Firebase, update it
        if (currentQuiz.id) {
            try {
                const quizDoc = doc(db, 'quizzes', currentQuiz.id);
                await updateDoc(quizDoc, {
                    questions: updatedQuestions
                });
            } catch (error) {
                console.error('Error updating quiz:', error);
            }
        }
    };

    const submitQuiz = async () => {
        try {
            const quizData = {
                ...currentQuiz,
                questions,
                playbackId,
                createdAt: new Date().toISOString(),
                active: true,
                submissions: []
            };

            if (currentQuiz.id) {
                // Update existing quiz
                const quizDoc = doc(db, 'quizzes', currentQuiz.id);
                await updateDoc(quizDoc, quizData);
            } else {
                // Create new quiz
                await addDoc(collection(db, 'quizzes'), quizData);
            }

            setPreviewQuiz(quizData);
            setShowPreview(true);
            alert('Quiz submitted successfully!');
            setQuestions([]);
            setShowQuizForm(false);
        } catch (error) {
            console.error('Error submitting quiz:', error);
        }
    };

    const endQuiz = async () => {
        if (!currentQuiz.id) return;

        try {
            const quizDoc = doc(db, 'quizzes', currentQuiz.id);
            await updateDoc(quizDoc, { active: false });
            setCurrentQuiz({
                questions: [],
                streamId,
                active: true,
                createdAt: null
            });
            setQuestions([]);
            setShowPreview(false);
            alert('Quiz ended successfully!');
        } catch (error) {
            console.error('Error ending quiz:', error);
        }
    };

    return (
        <Box>
            {!showQuizForm && !showPreview && (
                <Button 
                    onClick={() => setShowQuizForm(true)} 
                    variant="contained" 
                    color="success"
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    {currentQuiz.id ? 'Edit Quiz' : 'Create Quiz'}
                </Button>
            )}

            {showQuizForm && (
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Stack spacing={2}>
                        <TextField
                            placeholder="Enter your question"
                            value={currentQuestion}
                            onChange={(e) => setCurrentQuestion(e.target.value)}
                            fullWidth
                            variant="outlined"
                        />
                        {options.map((option, index) => (
                            <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <TextField
                                    placeholder={`Option ${index + 1}`}
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={correctAnswers.includes(index)}
                                            onChange={() => toggleCorrectAnswer(index)}
                                            color="success"
                                        />
                                    }
                                    label="Correct"
                                />
                                <IconButton 
                                    onClick={() => removeOption(index)} 
                                    color="error"
                                    size="small"
                                >
                                    <Trash size={16} />
                                </IconButton>
                            </Box>
                        ))}
                        <Stack direction="row" spacing={2}>
                            <Button 
                                onClick={addOption} 
                                variant="outlined" 
                                color="success"
                            >
                                Add Option
                            </Button>
                            <Button 
                                onClick={isEditing ? updateQuestion : addQuestion} 
                                variant="contained" 
                                color="primary"
                            >
                                {isEditing ? 'Update Question' : 'Add Question'}
                            </Button>
                            <Button 
                                onClick={submitQuiz} 
                                variant="contained" 
                                color="secondary"
                            >
                                {currentQuiz.id ? 'Update Quiz' : 'Submit Quiz'}
                            </Button>
                        </Stack>

                        <Box sx={{ mt: 4 }}>
                            {questions.map((question, index) => (
                                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Question {index + 1}:
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                        {question.question}
                                    </Typography>
                                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 1 }}>
                                        Options:
                                    </Typography>
                                    {question.options.map((option, idx) => (
                                        <Typography key={idx} variant="body2">
                                            {option}
                                        </Typography>
                                    ))}
                                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                        <Button 
                                            onClick={() => editQuestion(index)} 
                                            variant="outlined" 
                                            color="warning"
                                            size="small"
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            onClick={() => removeQuestion(index)} 
                                            variant="outlined" 
                                            color="error"
                                            size="small"
                                        >
                                            Delete
                                        </Button>
                                    </Stack>
                                </Paper>
                            ))}
                        </Box>
                    </Stack>
                </Paper>
            )}
            {showPreview && previewQuiz && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                        Quiz Preview
                    </Typography>
                    {previewQuiz.questions.map((question, qIndex) => (
                        <Paper key={qIndex} sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Question {qIndex + 1}: {question.question}
                            </Typography>
                            <Box sx={{ ml: 2 }}>
                                {question.options.map((option, oIndex) => (
                                    <Box key={oIndex} sx={{ mb: 1 }}>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                display: 'inline-block',
                                                px: 2,
                                                py: 1,
                                                borderRadius: 1,
                                                bgcolor: question.correctAnswers.includes(oIndex) 
                                                    ? green[100] 
                                                    : 'grey.100',
                                                color: question.correctAnswers.includes(oIndex) 
                                                    ? green[800] 
                                                    : 'text.primary',
                                            }}
                                        >
                                            {option}
                                            {question.correctAnswers.includes(oIndex) && (
                                                <Typography
                                                    component="span"
                                                    sx={{ ml: 1, color: green[600] }}
                                                >
                                                    (Correct Answer)
                                                </Typography>
                                            )}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    ))}
                    <Stack direction="row" spacing={2}>
                        <Button
                            onClick={() => {
                                setShowPreview(false);
                                setShowQuizForm(true);
                                setPreviewQuiz(null);
                            }}
                            variant="contained"
                            color="primary"
                        >
                            {currentQuiz.id ? 'Edit Quiz' : 'Create New Quiz'}
                        </Button>
                        <Button
                            onClick={endQuiz}
                            variant="contained"
                            color="error"
                        >
                            End Quiz
                        </Button>
                    </Stack>
                </Box>
            )}
        </Box>
    );
};

export default Quiz;
