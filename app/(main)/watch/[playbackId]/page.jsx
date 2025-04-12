import React from 'react';
import { getPlaybackInfo } from "@/app/lib/actions";
import VideoPlayer from '@/components/VideoPlayer';
import Likes from "@/components/Likes";
import Views from '@/components/Views';
import InteractiveComponents from '@/components/InteractiveComponents';
import WatchProductOverlay from '@/components/WatchProductOverlay';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import UserFollowButton from '@/components/UserFollowButton';
import LiveChat from '@/components/LiveChat';
import LiveComments from '@/components/LiveComments';
import LiveCommentInput from '@/components/LiveCommentInput';
import ShareButtons from '@/components/SocialMediaShare';
import { Box } from '@mui/material';
async function getStreamByPlaybackId(playbackId) {
  const snapshot = await getDocs(collection(db, 'streams'));
  for (const doc of snapshot.docs) {
    const data = doc.data();
    for (const [streamId, streamData] of Object.entries(data)) {
      if (streamData.playbackId === playbackId) {
        return {
          ...streamData,
          streamId,
          influencerId: doc.id
        };
      }
    }
  }
  return null;
}

export default async function VideoPage({ params }) {
  const { playbackId } = await params;
  const src = await getPlaybackInfo(playbackId);
  const streamData = await getStreamByPlaybackId(playbackId);

  return (
    <div className='w-full p-4 m-auto space-y-6 max-w-7xl  text-white'>
      {/* Main Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {/* Video Player Section (Left 3/4 on desktop) */}
        <div className='lg:col-span-3 space-y-4'>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "auto",
              aspectRatio: "16 / 9", // or whatever your video aspect is
              overflow: "hidden",
            }}
          >

            <VideoPlayer src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />

            <WatchProductOverlay streamData={streamData} />
          </Box>
          <ShareButtons />

          {/* Stats and Follow Button Row */}
          <div className='flex justify-between items-center px-2'>
            <div className='flex space-x-4'>
              <Likes playbackId={playbackId} />
              <Views playbackId={playbackId} />
            </div>
            <UserFollowButton influencerId={streamData.influencerId} />
          </div>

          {/* Live Comments Section */}
          <div className=' rounded-xl border border-gray-700 overflow-hidden'>
            <div className='p-4 border-b border-gray-700'>
              <h3 className='font-semibold text-lg'>Live Discussion</h3>
              <p className='text-sm text-gray-400 mt-1'>Join the conversation</p>
            </div>
            <div className='h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800'>
              <LiveComments
                influencerId={streamData.influencerId}
                streamId={streamData.streamId}
              />
            </div>
            <div className='border-t border-gray-700 p-4 '>
              <LiveCommentInput
                influencerId={streamData.influencerId}
                streamId={streamData.streamId}
              />
            </div>
          </div>
        </div>

        {/* Live Chat Section (Right 1/4 on desktop) */}
        <div className='lg:col-span-1 flex flex-col gap-4'>
          <div id='cf_checkout' className=' rounded-xl p-4 border border-gray-700'></div>
          <div className=' rounded-xl border border-gray-700 overflow-hidden flex-1'>
            <LiveChat playbackId={playbackId} />
          </div>
        </div>
      </div>

      {/* Interactive components at bottom */}
      <InteractiveComponents playbackId={playbackId} />
    </div>
  )
}