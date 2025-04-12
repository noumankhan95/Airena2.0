// 'use client';

// import { Typography  } from '@mui/material';
// import EditButton from '@/components/EditButton';
// import CopyButton from '@/components/CopyText';

// export default function StreamDetails({ streamId, streamKey, initialTitle }) {
//     return (
//         <div className='bg-gray-100 p-2 rounded-md'>
//             <h2 className="text-xl font-bold">
//             </h2>
//             <Typography variant="h2">
//                  Stream Details (for streaming software) 
//             </Typography>    
//             <p className='mt-2 text-gray-500'>
//                 Copy and paste the stream key into your streaming software. Use either the RTMP or SRT ingest, depending on your use-case.
//             </p>
//             <div className='mt-3 flex items-center gap-2'>
//                 <div>
//                     <h3 className='text-lg font-semibold'>Stream Key</h3>
//                     <p className='mt-[2px] text-gray-400 text-lg tracking-wide'>{streamKey}</p>
//                     <CopyButton streamKey={streamKey} />                 
//                 </div>
//             </div>
//             <div className='mt-3'>
//                 <h3 className='text-lg font-semibold'> RTMP ingest </h3>
//                 <p className='mt-[2px] text-gray-400 text-lg tracking-wide'> rtmp://rtmp.livepeer.com/live </p>
//                 <CopyButton streamKey={'rtmp://rtmp.livepeer.com/live'} />               
//             </div>
//             <div className='mt-3'>
//                 <h3 className='text-lg font-semibold'> SRT ingest (Beta)</h3>
//                 <p className='mt-[2px] text-gray-400 text-lg tracking-wide'>
//                     {`srt://rtmp.livepeer.com:2935?streamid=${streamKey}`}
//                 </p>
//                 <CopyButton streamKey={`srt://rtmp.livepeer.com:2935?streamid=${streamKey}`} />               
//             </div>
//             <div className='mt-4 flex items-center gap-2'>
//                 <EditButton streamId={streamId} initialTitle={initialTitle} />
//             </div>
//         </div>
//     );
// } 

'use client';

import EditButton from '@/components/EditButton';
import CopyButton from '@/components/CopyText';
import { Typography, Box, Paper } from '@mui/material';

export default function StreamDetails({ streamId, streamKey, initialTitle }) {
    return (
        <Box mt={4} component={Paper} elevation={3} padding={2}>
            <Typography variant="heading" gutterBottom>
                Stream Details (for streaming software)
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                Copy and paste the stream key into your streaming software. Use either the RTMP or SRT ingest, depending on your use-case.
            </Typography>
            
            <Box mt={3} display="flex" alignItems="center" gap={2}>
                <Box>
                    <Typography variant="heading" gutterBottom>
                        Stream Key
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        {streamKey}
                    </Typography>
                    <CopyButton streamKey={streamKey} />
                </Box>
            </Box>

            <Box mt={3}>
                <Typography variant="heading" gutterBottom>
                    RTMP ingest
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    rtmp://rtmp.livepeer.com/live
                </Typography>
                <CopyButton streamKey={'rtmp://rtmp.livepeer.com/live'} />
            </Box>

            <Box mt={3}>
                <Typography variant="heading" gutterBottom>
                    SRT ingest (Beta)
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    {`srt://rtmp.livepeer.com:2935?streamid=${streamKey}`}
                </Typography>
                <CopyButton streamKey={`srt://rtmp.livepeer.com:2935?streamid=${streamKey}`} />
            </Box>

            <Box mt={4} display="flex" alignItems="center" gap={2}>
                <EditButton streamId={streamId} initialTitle={initialTitle} />
            </Box>
        </Box>
    );
}
