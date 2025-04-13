'use client';
import React, { forwardRef } from 'react';
import { PlayIcon, PauseIcon, LoadingIcon, MuteIcon, UnmuteIcon, SettingsIcon, EnterFullscreenIcon, ExitFullscreenIcon } from '@livepeer/react/assets';
import * as Player from '@livepeer/react/player';
import { CheckIcon, ChevronDownIcon, XIcon } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
// import { getSrc } from '@livepeer/react/external';

export default function VideoPlayer({ src }) {
    return (
        <Player.Root src={src}>
            <Player.Container className="relative w-full h-full overflow-hidden bg-black">

                <Player.Video className="w-full h-full object-contain" />

                <Player.LoadingIndicator asChild>
                    <Loading />
                </Player.LoadingIndicator>

                <Player.ErrorIndicator matcher="all" asChild>
                    <Loading />
                </Player.ErrorIndicator>

                {/* Controls */}
                <Player.Controls className="absolute bottom-0 left-0 right-0 flex flex-col-reverse gap-2 p-4 bg-gradient-to-b from-transparent to-black/80">
                    <div className="flex items-center justify-between gap-6">

                        {/* Left Side Controls */}
                        <div className="flex items-center gap-6 flex-1">
                            {/* Play/Pause */}
                            <Player.PlayPauseTrigger className="w-14 h-14 flex items-center justify-center text-[#46C190] bg-transparent">
                                <Player.PlayingIndicator asChild matcher={false}>
                                    <PlayIcon />
                                </Player.PlayingIndicator>
                                <Player.PlayingIndicator asChild>
                                    <PauseIcon />
                                </Player.PlayingIndicator>
                            </Player.PlayPauseTrigger>

                            {/* Live Indicator */}
                            <Player.LiveIndicator className="w-14 h-14 flex items-center justify-center text-[#46C190] bg-transparent">
                                <div className="bg-[#ef4444] w-4 h-4 rounded-full"></div>
                                <span className="text-sm select-none">LIVE</span>
                            </Player.LiveIndicator>

                            {/* Mute/Unmute */}
                            <Player.MuteTrigger className="w-14 h-14 flex items-center justify-center text-[#46C190] bg-transparent">
                                <Player.VolumeIndicator asChild matcher={false}>
                                    <MuteIcon />
                                </Player.VolumeIndicator>
                                <Player.VolumeIndicator asChild matcher={true}>
                                    <UnmuteIcon />
                                </Player.VolumeIndicator>
                            </Player.MuteTrigger>

                            {/* Volume Bar */}
                            <Player.Volume className="relative flex items-center w-32 h-6">
                                <Player.Track className="bg-white/40 relative flex-grow h-[3px] rounded-full">
                                    <Player.Range className="absolute bg-[#46C190] h-full rounded-full" />
                                </Player.Track>
                                <Player.Thumb className="block w-4 h-4 bg-[#46C190] rounded-full" />
                            </Player.Volume>
                        </div>

                        {/* Right Side Controls */}
                        <div className="flex items-center gap-6">
                            {/* Fullscreen Icon */}
                            <Player.FullscreenTrigger className="w-14 h-14 flex items-center justify-center text-[#46C190] bg-transparent">
                                <Player.FullscreenIndicator asChild matcher={false}>
                                    <EnterFullscreenIcon />
                                </Player.FullscreenIndicator>
                                <Player.FullscreenIndicator asChild matcher={true}>
                                    <EnterFullscreenIcon />
                                </Player.FullscreenIndicator>
                            </Player.FullscreenTrigger>

                            {/* Settings */}
                            {/* <Settings /> */}
                        </div>

                    </div>
                </Player.Controls>

            </Player.Container>
        </Player.Root>
    );
}

const Seek = React.forwardRef(
    ({ children, ...props }, forwardedRef) => (
        <Player.Seek ref={forwardedRef} {...props}>
            <Player.Track
                className='bg-white/70 relative flex-grow rounded-full h-[2px]'
            >
                <Player.SeekBuffer
                    className='absolute bg-white/50 rounded-full h-full'
                />
                <Player.Range
                    className='absolute bg-white rounded-full h-full'
                />
            </Player.Track>
            <Player.Thumb
                className='block w-3 h-3 bg-white rounded-full'
            />
        </Player.Seek>
    )
);

const Loading = React.forwardRef(
    ({ children, ...props }, forwardedRef) => {
        return (
            <div
                {...props}
                className='absolute inset-0 flex flex-col items-center justify-center gap-5 bg-black backdrop-blur-[10px] text-center'
                ref={forwardedRef}
            >
                <div
                    className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                >
                    <LoadingIcon
                        className='w-8 h-8 animate-spin'
                    />
                </div>
            </div>
        );
    },
);

// const Settings = React.forwardRef(
//     ({ style, children, ...props }, forwardedRef) => {
//         return (
//             <Popover.Root>
//                 <Popover.Trigger ref={forwardedRef} asChild>
//                     <button
//                         type="button"
//                         style={style}
//                         aria-label="Playback settings"
//                         onClick={(e) => e.stopPropagation()}
//                         className="w-12 h-12 flex items-center justify-center text-[#46C190]"
//                     >
//                         <SettingsIcon
//                             style={{
//                                 width: 30,
//                                 height: 30,
//                                 color: '#46C190',backgroundColor:'none !important',
//                             }}
//                         />
//                     </button>
//                 </Popover.Trigger>

//                 <Popover.Portal>
//                     <Popover.Content
//                         side="top"
//                         alignOffset={-70}
//                         align="end"
//                         className="bg-black/60 backdrop-blur-md border border-white/20 p-4 rounded-lg shadow-lg"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <div className="flex flex-col gap-4">
//                             <p className="text-white text-lg font-semibold">Settings</p>

//                             {/* Playback Speed Section */}
//                             <Player.LiveIndicator className="flex flex-col gap-4" matcher={false}>
//                                 <label htmlFor="rateSelect" className="text-white text-sm">Playback Speed</label>
//                                 <Player.RateSelect name="rateSelect">
//                                     <Player.SelectTrigger
//                                         className="w-full flex items-center justify-between p-2 border rounded-md bg-gray-800 text-white border-gray-600 focus:outline-none"
//                                         aria-label="Playback speed"
//                                     >
//                                         <Player.SelectValue placeholder="Select a speed..." />
//                                         <Player.SelectIcon>
//                                             <ChevronDownIcon style={{ width: 14, height: 14 }} />
//                                         </Player.SelectIcon>
//                                     </Player.SelectTrigger>
//                                     <Player.SelectPortal>
//                                         <Player.SelectContent className="bg-black text-white rounded-md p-2">
//                                             <Player.SelectViewport>
//                                                 <Player.SelectGroup>
//                                                     <Player.SelectItem value={0.5} className="text-sm">0.5x</Player.SelectItem>
//                                                     <Player.SelectItem value={1} className="text-sm">1x</Player.SelectItem>
//                                                 </Player.SelectGroup>
//                                             </Player.SelectViewport>
//                                         </Player.SelectContent>
//                                     </Player.SelectPortal>
//                                 </Player.RateSelect>
//                             </Player.LiveIndicator>

//                             {/* Quality Section */}
//                             <div className="flex flex-col gap-4">
//                                 <label htmlFor="qualitySelect" className="text-white text-sm">Quality</label>
//                                 <Player.VideoQualitySelect name="qualitySelect">
//                                     <Player.SelectTrigger
//                                         className="w-full flex items-center justify-between p-2 border rounded-md bg-gray-800 text-white border-gray-600 focus:outline-none"
//                                         aria-label="Playback quality"
//                                     >
//                                         <Player.SelectValue placeholder="Select quality..." />
//                                         <Player.SelectIcon>
//                                             <ChevronDownIcon style={{ width: 14, height: 14 }} />
//                                         </Player.SelectIcon>
//                                     </Player.SelectTrigger>
//                                     <Player.SelectPortal>
//                                         <Player.SelectContent className="bg-black text-white rounded-md p-2">
//                                             <Player.SelectViewport>
//                                                 <Player.SelectGroup>
//                                                     <Player.SelectItem value="auto" className="text-sm">Auto (HD+)</Player.SelectItem>
//                                                     <Player.SelectItem value="1080p" className="text-sm">1080p (HD)</Player.SelectItem>
//                                                     <Player.SelectItem value="360p" className="text-sm">360p</Player.SelectItem>
//                                                 </Player.SelectGroup>
//                                             </Player.SelectViewport>
//                                         </Player.SelectContent>
//                                     </Player.SelectPortal>
//                                 </Player.VideoQualitySelect>
//                             </div>
//                         </div>

//                         {/* Close Button */}
//                         <Popover.Close
//                             className="absolute top-2 right-2 p-2 rounded-full bg-[#46C190] text-white"
//                             aria-label="Close"
//                         >
//                             <XIcon style={{ width: 16, height: 16 }} />
//                         </Popover.Close>

//                         <Popover.Arrow className="fill-white" />
//                     </Popover.Content>
//                 </Popover.Portal>
//             </Popover.Root>
//         );
//     },
// );

const RateSelectItem = forwardRef(
    ({ children, ...props }, forwardedRef) => {
        return (
            <Player.RateSelectItem
                style={{
                    fontSize: 12,
                    borderRadius: 5,
                    display: "flex",
                    alignItems: "center",
                    paddingRight: 35,
                    paddingLeft: 25,
                    position: "relative",
                    userSelect: "none",
                    height: 30,
                }}
                {...props}
                ref={forwardedRef}
            >
                <Player.SelectItemText>{children}</Player.SelectItemText>
                <Player.SelectItemIndicator
                    style={{
                        position: "absolute",
                        left: 0,
                        width: 25,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CheckIcon style={{ width: 14, height: 14 }} />
                </Player.SelectItemIndicator>
            </Player.RateSelectItem>
        );
    },
);

const VideoQualitySelectItem = forwardRef(({ children, ...props }, forwardedRef) => {
    return (
        <Player.VideoQualitySelectItem
            style={{
                fontSize: 12,
                borderRadius: 5,
                display: "flex",
                alignItems: "center",
                paddingRight: 35,
                paddingLeft: 25,
                position: "relative",
                userSelect: "none",
                height: 30,
            }}
            {...props}
            ref={forwardedRef}
        >
            <Player.SelectItemText>{children}</Player.SelectItemText>
            <Player.SelectItemIndicator
                style={{
                    position: "absolute",
                    left: 0,
                    width: 25,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CheckIcon style={{ width: 14, height: 14 }} />
            </Player.SelectItemIndicator>
        </Player.VideoQualitySelectItem>
    );
});
