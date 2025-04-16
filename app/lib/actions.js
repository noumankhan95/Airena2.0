'use server';

import { Livepeer } from "livepeer";
import { getSrc } from "@livepeer/react/external";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, messaging } from '@/firebase'; // Adjust path if necessary
import { collection, doc, setDoc, getDocs, updateDoc, getDoc } from 'firebase/firestore';
import { isAbortError } from "livepeer/lib/http";
import { isAccessor } from "typescript";

const livepeer = new Livepeer({
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_API_KEY,
});

// export const getAllStreams = async () => {
//     console.log("Fetching streams...");
//     try {
//         const streams =  (await livepeer.stream.getAll()).data.filter((stream) => stream?.playbackId !== undefined);
//         // console.log(streams);
//         return streams;
//     } catch (error) {
//         console.error("Error fetching streams:", error);
//         return [];
//     }
// };

export const getAllStreams = async () => {
    try {
        // Pre-defined categories
        const predefinedCategories = ["Gaming", "Sports"];
        const groupedStreams = {};

        // Initialize categories with empty arrays
        predefinedCategories.forEach((category) => {
            groupedStreams[category] = [];
        });

        // Get all influencer documents from streams collection
        const snapshot = await getDocs(collection(db, 'streams'));

        // Process each influencer's streams
        snapshot.docs.forEach(influencerDoc => {
            const influencerData = influencerDoc.data();

            // Process each stream under this influencer
            Object.entries(influencerData).forEach(([streamId, streamData]) => {
                if (streamData.Isactive) {
                    // Get the category and ensure it's in the predefined list
                    let category = streamData.category?.trim() || "Uncategorized";
                    category = predefinedCategories.find(cat =>
                        cat.toLowerCase() === category.toLowerCase()
                    ) || "Uncategorized";

                    // Add the stream to the appropriate category
                    if (!groupedStreams[category]) {
                        groupedStreams[category] = [];
                    }

                    // Add the stream with its data
                    groupedStreams[category].push({
                        ...streamData,
                        id: streamId,
                        influencerId: influencerDoc.id,
                        name: streamData.title,
                        title: streamData.title,
                        category: streamData.category,
                        isActive: streamData.Isactive,
                        playbackId: streamData.playbackId
                    });
                }
            });
        });

        return groupedStreams;
    } catch (error) {
        console.error("Error fetching streams:", error);
        return {};
    }
};



export const getPlaybackInfo = async (playbackId) => {
    try {
        const playbackInfo = await livepeer.playback.get(playbackId);
        const src = getSrc(playbackInfo.playbackInfo);
        return src;
        // return playbackInfo.playbackInfo;
    } catch (error) {
        console.error("Error fetching playback info:", error);
        return null;
    }
};


//hasnain made changes here in this function created by kamran
export const createStream = async (formData) => {
    let stream = null;
    try {
        const title = formData.get('title');
        const category = formData.get('category');
        const influencerId = formData.get('influencerId'); // Get influencer ID from form data
        const influencerName = formData.get("influencerName")
        if (!influencerId) {
            throw new Error('Influencer ID is required');
        }

        stream = (await livepeer.stream.create({ name: formData.get('title') })).stream;
        console.log("Stream in action", stream)
        // Create a new stream document under the influencer's document
        const streamData = {
            influencerId,
            influencerName: influencerName,
            title: title,
            category: category,
            streamId: stream.id,
            id: stream.id,
            playbackId: stream.playbackId,
            createdAt: new Date().toISOString(),
            Isactive: true,
            isActive: stream.isActive,
            streamKey: stream.streamKey,
            endedAt: '',
            totalViews: 0, // Initialize total views
            streamDuration: 0, // Initialize stream duration in seconds
            streamStartTime: null, // Will be set when stream becomes active
            lastActiveTime: null // Will be updated periodically
        };

        // Store stream data in Firestore under the influencer's document
        await setDoc(doc(db, 'streams', influencerId), {
            [stream.id]: streamData // Use stream ID as the key for the stream data
        }, { merge: true }); // Use merge to preserve other streams under this influencer

    } catch (error) {
        console.error("Error creating stream:", error);
        return null;
    }
    if (stream === null) return null;
    redirect(`/CreatorPanel/live/${stream.id}`);
}



export const updateStreamTitle = async (streamId, newTitle) => {
    try {
        const updatedStream = await livepeer.stream.update({ name: newTitle }, streamId);

        // Ensure only plain objects are returned
        return { success: true, updatedStream: { name: updatedStream.name } };
    } catch (error) {
        console.error("Error updating stream title:", error);
        return { success: false, error: error.message };
    }
};

export const getLiveViews = async (playbackId) => {
    try {
        const views = (await livepeer.metrics.getRealtimeViewership(playbackId))?.data[0]?.viewCount;
        return views;
    } catch (error) {
        console.error("Error fetching live views:", error);
        return 0;
    }
}

export const getStreamById = async (streamId) => {
    try {
        // Get all influencer documents from streams collection
        const snapshot = await getDocs(collection(db, 'streams'));

        // Search through all influencer documents to find the stream
        for (const influencerDoc of snapshot.docs) {
            const influencerData = influencerDoc.data();
            const streamData = influencerData[streamId];

            if (streamData) {
                // Get the current stream status from Livepeer
                const livepeerStream = (await livepeer.stream.get(streamId)).stream;

                // Combine the data
                return {
                    ...streamData,
                    ...livepeerStream,
                    id: streamId,
                    influencerId: influencerDoc.id
                };
            }
        }

        return null;
    } catch (error) {
        console.error("Error fetching stream:", error);
        return null;
    }
}

export const endStream = async (streamId, influencerId) => {
    try {
        // Get the stream document for this influencer
        const influencerDoc = await getDoc(doc(db, 'streams', influencerId));

        if (!influencerDoc.exists()) {
            throw new Error('Stream not found');
        }

        const influencerData = influencerDoc.data();
        const streamData = influencerData[streamId];

        if (!streamData) {
            throw new Error('Stream not found');
        }

        // Calculate stream duration
        const startTime = streamData.streamStartTime ? new Date(streamData.streamStartTime) : null;
        const endTime = new Date();
        const duration = startTime ? Math.floor((endTime - startTime) / 1000) : 0;

        // Update the stream data under the influencer's document
        await setDoc(doc(db, 'streams', influencerId), {
            [streamId]: {
                ...streamData,
                Isactive: false,
                isActive: false,
                endedAt: endTime.toISOString(),
                streamDuration: duration,
                lastActiveTime: endTime.toISOString()
            }
        }, { merge: true });

        // End the stream in Livepeer
        await livepeer.stream.delete(streamId);

        return { success: true };
    } catch (error) {
        console.error("Error ending stream:", error);
        return { success: false, error: error.message };
    }
}

export const updateStreamStatus = async (streamId, influencerId) => {
    try {
        // Get the stream document for this influencer
        const influencerDoc = await getDoc(doc(db, 'streams', influencerId));

        if (!influencerDoc.exists()) {
            throw new Error('Stream not found');
        }

        const influencerData = influencerDoc.data();
        const streamData = influencerData[streamId];

        if (!streamData) {
            throw new Error('Stream not found');
        }

        // Get current stream status from Livepeer
        const streamStatus = await livepeer.stream.get(streamId);
        const isActive = streamStatus.stream.isActive;
        const currentTime = new Date();

        // Calculate duration if stream is active
        let duration = streamData.streamDuration || 0;
        if (isActive && streamData.streamStartTime) {
            const startTime = new Date(streamData.streamStartTime);
            duration = Math.floor((currentTime - startTime) / 1000);
        }

        // Update the stream data under the influencer's document
        await setDoc(doc(db, 'streams', influencerId), {
            [streamId]: {
                ...streamData,
                isActive,
                Isactive: isActive,
                streamDuration: duration,
                lastActiveTime: currentTime.toISOString(),
                // Update start time if stream just became active
                streamStartTime: isActive && !streamData.streamStartTime ? currentTime.toISOString() : streamData.streamStartTime
            }
        }, { merge: true });

        return { success: true };
    } catch (error) {
        console.error("Error updating stream status:", error);
        return { success: false, error: error.message };
    }
}

export const updateStreamProducts = async (streamId, influencerId, products) => {
    try {
        // Update the stream document with selected products
        await setDoc(doc(db, 'streams', influencerId), {
            [streamId]: {
                selectedProducts: products
            }
        }, { merge: true });
        return true;
    } catch (error) {
        console.error("Error updating stream products:", error);
        return false;
    }
};

export const CreateInstreamOrder = async (email, quantity = 1, variant_id) => {
    try {
        const response = await fetch("/api/user/placeOrder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                customerEmail: email,
                lineItems: [
                    {
                        variant_id,
                        quantity,
                    },
                ],
            }),
        });
        if (!response.ok) throw "Error Placing Order"
        const data = await response.json();
        return { success: true, message: data };
    } catch (e) {
        console.error("Error updating stream products:", error);
        return { success: false, error: error.message };
    }
}


import { arrayUnion } from 'firebase/firestore';


export async function followInfluencer(influencerId, userId) {
    try {
        const influencerRef = doc(db, 'influencers', influencerId);
        const userRef = doc(db, 'users', userId);

        // Initialize followers array if it doesn't exist
        const influencerDoc = await getDoc(influencerRef);
        if (!influencerDoc.exists() || !influencerDoc.data().followers) {
            await updateDoc(influencerRef, { followers: [] });
        }

        // Initialize following array if it doesn't exist
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists() || !userDoc.data().following) {
            await updateDoc(userRef, { following: [] });
        }

        // Add the user to the influencer's followers list
        await updateDoc(influencerRef, {
            followers: arrayUnion(userId),
        });

        // Add the influencer to the user's following list
        await updateDoc(userRef, {
            following: arrayUnion(influencerId),
        });

        console.log("Follow successful");
    } catch (error) {
        console.error("Error in followInfluencer:", error);
        throw new Error("Failed to follow influencer");
    }
}


import { arrayRemove } from 'firebase/firestore';


export async function unfollowInfluencer(influencerId, userId) {
    try {
        const influencerRef = doc(db, 'influencers', influencerId);
        const userRef = doc(db, 'users', userId);

        // Remove the user from the influencer's followers list
        await updateDoc(influencerRef, {
            followers: arrayRemove(userId),
        });

        // Remove the influencer from the user's following list
        await updateDoc(userRef, {
            following: arrayRemove(influencerId),
        });

        console.log("Unfollow successful");
    } catch (error) {
        console.error("Error in unfollowInfluencer:", error);
        throw new Error("Failed to unfollow influencer");
    }
}


// Check if the user is following the influencer
export async function checkIfFollowing(influencerId, userId) {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
        console.log("INF id", influencerId)
        const userData = userDoc.data();
        console.log(userData.following.includes(influencerId), 'iserData')
        return userData?.following?.includes(influencerId);
    }

    return false;
}


