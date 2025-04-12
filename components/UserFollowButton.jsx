'use client';

import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { followInfluencer, unfollowInfluencer, checkIfFollowing } from '@/app/lib/actions';
import useOwnersStore from "@/store/dealersPanel/OwnersInfo";
import { useRouter } from 'next/navigation';
export default function UserFollowButton({ influencerId, userId }) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { info: { uid: currentUserId } } = useOwnersStore();
    const router = useRouter();

    // Check if the user is already following the influencer
    useEffect(() => {
        const checkFollowingStatus = async () => {
            console.log("CJeckong here")
            if (currentUserId) {
                console.log("CJeckong here 2")
                const following = await checkIfFollowing(influencerId, currentUserId);
                console.log("following", following)
                setIsFollowing(following);
            }
        };


        checkFollowingStatus();
    }, [influencerId, currentUserId]);

    // Handle follow/unfollow button click
    const handleFollow = async () => {
        if (isLoading) return;

        // Check if user is logged in
        if (!currentUserId) {
            // Redirect to login page if not logged in
            router.push('/user/SignIn');
            return;
        }

        setIsLoading(true);
        try {
            if (!isFollowing) {
                console.log("NOt")
                await followInfluencer(influencerId, currentUserId);
                setIsFollowing(true);
                const token = await requestNotificationPermission();
                if (token) {
                    await fetch("/api/subscribeNotifications", {
                        method: "POST",
                        body: JSON.stringify({
                            fcmToken: token,
                            influencerId
                        })
                    })
                }
            } else {
                console.log("YES")

                // Allow users to unsubscribe
                await unfollowInfluencer(influencerId, currentUserId);
                setIsFollowing(false);
            }
        } catch (error) {
            console.error("Error updating subscription status:", error);
        } finally {
            setIsLoading(false);
        }
    };
    console.log("is FOlolowing", isFollowing)
    console.log("userID", currentUserId)
    console.log("infUid", influencerId)


    return (
        <Button
            variant="contained"
            onClick={handleFollow}
            disabled={isLoading}
            sx={{
                backgroundColor: isFollowing ? '#46C290' : '#46C190',
                color: 'white',
                '&:hover': {
                    backgroundColor: isFollowing ? '#AA0000' : '#404040',
                },
                fontWeight: 'bold',
                borderRadius: '2px',
                textTransform: 'none',
                padding: '6px 16px',
                fontSize: '14px',
                '&.Mui-disabled': {
                    backgroundColor: isFollowing ? '#46C290' : '#46C190',
                    color: 'white',
                },
            }}
        >
            {isLoading ? "Loading..." : isFollowing ? "Unsubscribe" : "Subscribe"}
        </Button>
    );
}