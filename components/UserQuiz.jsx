'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { Box, Typography, Button, Paper, Stack, Alert } from '@mui/material';
import { green, blue, red } from '@mui/material/colors';

const UserQuiz = ({ playbackId }) => {
    const [quiz, setQuiz] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
        if (!playbackId) return;

        const quizRef = collection(db, 'quizzes');
        const q = query(quizRef,
            where('playbackId', '==', playbackId),
            where('active', '==', true)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const quizData = [];
            snapshot.forEach((doc) => {
                quizData.push({ ...doc.data(), id: doc.id });
            });
            // Get the most recent active quiz
            const activeQuiz = quizData.find(q => q.active);
            if (activeQuiz) {
                setQuiz(activeQuiz);
                // Check if user has already submitted this quiz
                const userSubmission = activeQuiz.submissions?.find(
                    sub => sub.userId === 'user123' // Replace with actual user ID
                );
                if (userSubmission) {
                    setUserAnswers(userSubmission.answers);
                    setShowResults(true);
                    setHasSubmitted(true);
                }
            } else {
                setQuiz(null);
                setUserAnswers({});
                setShowResults(false);
                setHasSubmitted(false);
            }
        });

        return () => unsubscribe();
    }, [playbackId]);

    const handleAnswerSelect = (questionIndex, optionIndex) => {
        if (hasSubmitted) return;

        setUserAnswers(prev => ({
            ...prev,
            [questionIndex]: optionIndex
        }));
    };

    const submitQuiz = async () => {
        if (!quiz || hasSubmitted) return;

        try {
            // Calculate score
            let score = 0;
            quiz.questions.forEach((question, index) => {
                if (question.correctAnswers.includes(userAnswers[index])) {
                    score++;
                }
            });

            const submission = {
                userId: 'user123', // Replace with actual user ID
                answers: userAnswers,
                score,
                totalQuestions: quiz.questions.length,
                submittedAt: new Date().toISOString()
            };

            // Update quiz with user's submission
            const quizDoc = doc(db, 'quizzes', quiz.id);
            await updateDoc(quizDoc, {
                submissions: arrayUnion(submission)
            });

            setShowResults(true);
            setHasSubmitted(true);
        } catch (error) {
            console.error('Error submitting quiz:', error);
        }
    };

    if (!quiz) {
        return (
            <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                <Typography variant="body1">
                    No active quiz at the moment
                </Typography>
            </Box>
        );
    }

    if (!quiz.active) {
        return (
            <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                <Typography variant="body1">
                    This quiz has ended
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 2 }}>
            <Paper elevation={2} sx={{ p: 3 }}>
                {quiz.questions.map((question, qIndex) => (
                    <Box key={qIndex} sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Question {qIndex + 1}: {question.question}
                        </Typography>
                        <Stack spacing={2}>
                            {question.options.map((option, oIndex) => (
                                <Paper
                                    key={oIndex}
                                    onClick={() => handleAnswerSelect(qIndex, oIndex)}
                                    sx={{
                                        p: 2,
                                        cursor: hasSubmitted ? 'default' : 'pointer',
                                        transition: 'all 0.2s',
                                        bgcolor: userAnswers[qIndex] === oIndex
                                            ? '#27896C' // Darker teal-green background
                                            : 'background.paper',
                                        color: userAnswers[qIndex] === oIndex
                                            ? 'white' // White text on dark bg
                                            : 'inherit',
                                        border: userAnswers[qIndex] === oIndex
                                            ? `2px solid #46C190`
                                            : '1px solid',
                                        borderColor: 'divider',
                                        '&:hover': {
                                            bgcolor: hasSubmitted ? 'background.paper' : '#27896C', // Same dark green on hover
                                            color: hasSubmitted ? 'inherit' : 'white',
                                        },
                                    }}
                                >
                                    <Typography variant="body1">
                                        {option}
                                        {showResults && (
                                            <Typography
                                                component="span"
                                                sx={{
                                                    ml: 1,
                                                    color: question.correctAnswers.includes(oIndex)
                                                        ? green[600]
                                                        : userAnswers[qIndex] === oIndex
                                                            ? red[600]
                                                            : 'transparent',
                                                }}
                                            >
                                                {question.correctAnswers.includes(oIndex)
                                                    ? '✓ Correct'
                                                    : userAnswers[qIndex] === oIndex
                                                        ? '✗ Incorrect'
                                                        : ''}
                                            </Typography>
                                        )}
                                    </Typography>
                                </Paper>
                            ))}
                        </Stack>
                    </Box>
                ))}
                {!hasSubmitted && (
                    <Button
                        onClick={submitQuiz}
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Submit Quiz
                    </Button>
                )}
                {showResults && (
                    <Alert
                        severity="success"
                        sx={{ mt: 2 }}
                    >
                        <Typography variant="body1" fontWeight="bold">
                            Quiz submitted! Your score: {
                                Object.keys(userAnswers).filter(qIndex =>
                                    quiz.questions[qIndex].correctAnswers.includes(userAnswers[qIndex])
                                ).length
                            } / {quiz.questions.length}
                        </Typography>
                    </Alert>
                )}
            </Paper>
        </Box>
    );
};

export default UserQuiz;