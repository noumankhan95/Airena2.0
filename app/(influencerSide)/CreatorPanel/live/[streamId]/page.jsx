import React from "react";
import { getPlaybackInfo, getStreamById } from "@/app/lib/actions";
import StreamContent from '@/components/StreamContent';

export default async function StreamPage({ params }) {
    const { streamId } = await (params);
    const stream = await getStreamById(streamId);
    const src = await getPlaybackInfo(stream.playbackId);
    console.log(streamId)
    if (!stream) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Stream not found</h1>
                    <p className="text-gray-400">The stream you're looking for doesn't exist or has been ended.</p>
                </div>
            </div>
        );
    }

    return <StreamContent stream={stream} src={src} streamId={streamId} />;
}


