'use client';

import React, { useState, useEffect } from 'react';
import { Trash, Edit3 } from 'lucide-react';
import { db } from '@/firebase';
import { collection, addDoc, updateDoc, doc, query, where, onSnapshot } from 'firebase/firestore';
import { TextField, Button, Typography, Box, Paper, IconButton, Stack, LinearProgress } from '@mui/material';
import { green, blue, red } from '@mui/material/colors';

const Poll = ({ playbackId }) => {
    const [currentPoll, setCurrentPoll] = useState({
        question: '',
        options: ['Option 1', 'Option 2'],
        votes: [0, 0],
        playbackId: '',
        active: true,
        createdAt: null
    });
    const [showPollForm, setShowPollForm] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    // Fetch polls for this stream
    useEffect(() => {
        if (!playbackId) return;

        const pollRef = collection(db, 'polls');
        const q = query(pollRef,
            where('playbackId', '==', playbackId),
            where('active', '==', true)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const pollData = [];
            snapshot.forEach((doc) => {
                pollData.push({ ...doc.data(), id: doc.id });
            });
            // Find the active poll for this stream
            const activePoll = pollData.find(poll => poll.active);
            if (activePoll) {
                setCurrentPoll(activePoll);
            } else {
                setCurrentPoll({
                    question: '',
                    options: ['Option 1', 'Option 2'],
                    votes: [0, 0],
                    playbackId,
                    active: true,
                    createdAt: null
                });
            }
        });

        return () => unsubscribe();
    }, [playbackId]);

    const addOption = () => {
        setCurrentPoll(prev => ({
            ...prev,
            options: [...prev.options, `Option ${prev.options.length + 1}`],
            votes: [...prev.votes, 0]
        }));
    };

    const handleOptionChange = (index, value) => {
        setCurrentPoll(prev => {
            const newOptions = [...prev.options];
            newOptions[index] = value;
            return { ...prev, options: newOptions };
        });
    };

    const submitPoll = async () => {
        if (currentPoll.question.trim() === '') {
            alert('Poll question cannot be empty');
            return;
        }
        if (currentPoll.options.some(opt => opt.trim() === '')) {
            alert('Options cannot be empty');
            return;
        }

        try {
            const pollData = {
                ...currentPoll,
                playbackId,
                createdAt: new Date().toISOString(),
                active: true,
                votes: currentPoll.votes,
                voters: []
            };

            if (currentPoll.id) {
                // Update existing poll
                const pollDoc = doc(db, 'polls', currentPoll.id);
                await updateDoc(pollDoc, pollData);
            } else {
                // Create new poll
                await addDoc(collection(db, 'polls'), pollData);
            }

            setShowPreview(true);
            setShowPollForm(false);
        } catch (error) {
            console.error('Error submitting poll:', error);
        }
    };

    const deactivatePoll = async () => {
        if (!currentPoll.id) return;

        try {
            const pollDoc = doc(db, 'polls', currentPoll.id);
            await updateDoc(pollDoc, { active: false });
            setCurrentPoll({
                question: '',
                options: ['Option 1', 'Option 2'],
                votes: [0, 0],
                playbackId,
                active: true,
                createdAt: null
            });
            setShowPreview(false);
        } catch (error) {
            console.error('Error deactivating poll:', error);
        }
    };

    return (
        <Box>
            {!showPollForm && !showPreview && (
                <Button
                    onClick={() => setShowPollForm(true)}
                    variant="contained"
                    color="success"
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    {currentPoll.id ? 'Edit Poll' : 'Create Poll'}
                </Button>
            )}
            {showPollForm && (
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Stack spacing={2}>
                        <TextField
                            placeholder="Enter your poll question"
                            value={currentPoll.question}
                            onChange={(e) => setCurrentPoll(prev => ({ ...prev, question: e.target.value }))}
                            fullWidth
                            variant="outlined"
                        />
                        {currentPoll?.options?.map((option, index) => (
                            <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <TextField
                                    placeholder={`Option ${index + 1}`}
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                />
                                <IconButton 
                                    onClick={() => {
                                        const newOptions = currentPoll.options.filter((_, i) => i !== index);
                                        const newVotes = currentPoll.votes.filter((_, i) => i !== index);
                                        setCurrentPoll(prev => ({
                                            ...prev,
                                            options: newOptions,
                                            votes: newVotes
                                        }));
                                    }}
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
                                onClick={submitPoll} 
                                variant="contained" 
                                color="primary"
                            >
                                {currentPoll.id ? 'Update Poll' : 'Submit Poll'}
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>
            )}
            {showPreview && currentPoll.id && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                        Active Poll
                    </Typography>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 3 }}>
                            {currentPoll.question}
                        </Typography>
                        <Stack spacing={2}>
                            {currentPoll.options.map((option, index) => (
                                <Box key={index}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body1">{option}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {currentPoll.votes[index]} votes
                                        </Typography>
                                    </Box>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={(currentPoll.votes[index] / Math.max(...currentPoll.votes)) * 100} 
                                        sx={{ 
                                            height: 8, 
                                            borderRadius: 4,
                                            bgcolor: 'grey.200',
                                            '& .MuiLinearProgress-bar': {
                                                bgcolor: blue[500],
                                            }
                                        }}
                                    />
                                </Box>
                            ))}
                        </Stack>
                        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                            <Button
                                onClick={() => {
                                    setShowPreview(false);
                                    setShowPollForm(true);
                                }}
                                variant="contained"
                                color="primary"
                            >
                                Edit Poll
                            </Button>
                            <Button
                                onClick={deactivatePoll}
                                variant="contained"
                                color="error"
                            >
                                End Poll
                            </Button>
                        </Stack>
                    </Paper>
                </Box>
            )}
        </Box>
    );
};

export default Poll;
