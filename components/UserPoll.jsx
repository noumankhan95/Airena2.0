'use client';
import React, { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { Box, Typography, Button, Paper, Stack, LinearProgress } from '@mui/material';
import { blue } from '@mui/material/colors';

const UserPoll = ({ playbackId }) => {
    const [poll, setPoll] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);

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
            // Get the active poll for this stream
            const activePoll = pollData.find(p => p.active);
            if (activePoll) {
                setPoll(activePoll);
                // Check if user has already voted
                setHasVoted(activePoll.voters?.includes('user123')); // Replace with actual user ID
            } else {
                setPoll(null);
                setHasVoted(false);
            }
        });

        return () => unsubscribe();
    }, [playbackId]);

    const handleVote = async (optionIndex) => {
        if (!poll || hasVoted) return;

        try {
            const pollDoc = doc(db, 'polls', poll.id);
            const newVotes = [...poll.votes];
            newVotes[optionIndex] += 1;

            await updateDoc(pollDoc, {
                votes: newVotes,
                voters: arrayUnion('user123') // Replace with actual user ID
            });

            setHasVoted(true);
        } catch (error) {
            console.error('Error submitting vote:', error);
        }
    };

    const calculatePercentage = (votes, totalVotes) => {
        if (totalVotes === 0) return 0;
        return Math.round((votes / totalVotes) * 100);
    };

    if (!poll) {
        return (
            <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                <Typography variant="body1">
                    No active poll at the moment
                </Typography>
            </Box>
        );
    }

    const totalVotes = poll.votes.reduce((sum, current) => sum + current, 0);

    return (
        <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
                {poll.question}
            </Typography>
            <Stack spacing={2}>
                {poll.options.map((option, index) => {
                    const percentage = calculatePercentage(poll.votes[index], totalVotes);
                    
                    return (
                        <Box 
                            key={index}
                            onClick={() => !hasVoted && handleVote(index)}
                            sx={{
                                position: 'relative',
                                p: 2,
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                                cursor: hasVoted ? 'default' : 'pointer',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    bgcolor: hasVoted ? 'background.paper' : blue[50],
                                },
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                                <Typography variant="body1">{option}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {poll.votes[index]} votes ({percentage}%)
                                </Typography>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={percentage}
                                sx={{ 
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    height: '100%',
                                    width: `${percentage}%`,
                                    opacity: hasVoted ? 1 : 0,
                                    transition: 'opacity 0.5s',
                                    bgcolor: 'transparent',
                                    '& .MuiLinearProgress-bar': {
                                        bgcolor: blue[100],
                                    }
                                }}
                            />
                        </Box>
                    );
                })}
            </Stack>
            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    {hasVoted ? `Total votes: ${totalVotes}` : 'Click an option to vote'}
                </Typography>
            </Box>
        </Paper>
    );
};

export default UserPoll; 