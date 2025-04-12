'use client';

import { useEffect, useState } from 'react';
import { updateStreamStatus, endStream } from '@/app/lib/actions';
import useOwnersStore from "@/store/dealersPanel/OwnersInfo";
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation'; // Added useRouter
import useInfluencersInfo from "@/store/influencerPanel/OwnersInfo";

export default function StreamStatusUpdater({ streamId }) {
    const { uid: influencerId } = useInfluencersInfo();
    const [isEnding, setIsEnding] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter(); // Initialize router

    useEffect(() => {
        if (!streamId || !influencerId) return;

        const updateStatus = async () => {
            const result = await updateStreamStatus(streamId, influencerId);
            if (!result.success) {
                console.error('Failed to update stream status:', result.error);
                toast.error('Failed to update stream status');
            }
        };

        updateStatus();
        const interval = setInterval(updateStatus, 30000);
        return () => clearInterval(interval);
    }, [streamId, influencerId]);

    // Function to end the stream
    const handleEndStream = async () => {
        console.log(streamId)
        console.log(influencerId, "and ")

        if (!streamId || !influencerId) return;

        setIsEnding(true);
        try {
            const result = await endStream(streamId, influencerId);
            if (result.success) {
                toast.success('Stream ended successfully');
                // Navigate to analytics page with parameters
                router.push(`/influencerPanel/streamanalytics/?influencerId=${influencerId}&streamId=${streamId}`);
            } else {
                toast.error(result.error || 'Failed to end stream');
            }
        } catch (error) {
            console.error('Error ending stream:', error);
            toast.error('Failed to end stream');
        } finally {
            setIsEnding(false);
            setShowConfirm(false);
        }
    };

    // Function to show confirmation modal
    const confirmEndStream = () => {
        setShowConfirm(true);
    };

    // Add beforeunload event listener to confirm leaving the page
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            const message = "Are you sure you want to leave? This will end the live stream.";
            event.returnValue = message; // Standard for most browsers

            return message; // For some browsers like Chrome
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return (
        <div>
            {showConfirm ? (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#0D1F12] p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold text-white mb-4">End Stream?</h3>
                        <p className="text-gray-400 mb-6">Are you sure you want to end this stream? This action cannot be undone.</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEndStream}
                                disabled={isEnding}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isEnding ? 'Ending...' : 'End Stream'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <button
                    onClick={confirmEndStream}
                    className="w-full px-6 py-3 bg-green-500 text-black rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    End Stream
                </button>
            )}
        </div>
    );
}
