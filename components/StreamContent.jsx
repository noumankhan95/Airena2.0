'use client';

import VideoPlayer from '@/components/VideoPlayer';
import LiveChat from '@/components/LiveChat';
import Likes from '@/components/Likes';
import Views from '@/components/Views';
import Quiz from '@/components/Quiz';
import Poll from '@/components/Poll';
import StreamStatusUpdater from '@/components/StreamStatusUpdater';
import StreamDetails from '@/components/StreamDetails';
import ProductSelection from '@/components/ProductSelection';
import ProductOverlay from '@/components/ProductOverlay';
import UserProductOverlay from '@/components/UserProductOverlay';
import InfluencerFollowersCount from '@/components/InfluencerFollowersCount'; // New component for influencers
import { Button } from '@mui/material';
import { LocalOffer } from '@mui/icons-material';
import { useState, useEffect, useRef } from 'react';
import useOwnersStore from "@/store/dealersPanel/OwnersInfo";
import { updateStreamProducts } from '@/app/lib/actions';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/firebase';
import useInfluencersInfo from '@/store/influencerPanel/OwnersInfo';
import ShareButtons from './SocialMediaShare';

export default function StreamContent({ stream, src, streamId }) {
    const [isProductSelectionOpen, setIsProductSelectionOpen] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    // const { info: { uid: currentUserId } } = useOwnersStore();
    console.log("Stream", stream)
    const { uid: currentUserId } = useInfluencersInfo()
    const isStreamer = currentUserId === stream.influencerId;
    const productOverlayRef = useRef(null);


    // Subscribe to product updates
    useEffect(() => {
        if (!stream?.influencerId) return;

        console.log("isStreamer", isStreamer);

        if (stream.selectedProducts) {
            setSelectedProducts(stream.selectedProducts);
        }

        const unsubscribe = onSnapshot(
            doc(db, 'streams', stream.influencerId),
            (docSnapshot) => {
                if (!docSnapshot.exists()) return;

                const data = docSnapshot.data();
                if (data?.[streamId]?.selectedProducts) {
                    setSelectedProducts(data[streamId].selectedProducts);
                }

            },
            (error) => {
                console.error("Error listening to product changes:", error);
            }
        );

        return () => unsubscribe();
    }, [stream?.influencerId, streamId]);

    const handleProductsSelect = async (products) => {
        if (!stream?.influencerId) return;

        try {
            await updateStreamProducts(streamId, stream.influencerId, products);
        } catch (error) {
            console.error("Error updating products:", error);
        }
    };
    return (
        <div className='max-w-screen-2xl m-auto p-4'>
            <StreamStatusUpdater streamId={streamId} />
            <div className='w-full m-auto grid grid-cols-1 lg:grid-cols-3 !space-x-4 !gap-4 !mt-5'>
                <div className='aspect-video lg:col-span-2 relative'>
                    <VideoPlayer src={src} />

                    {/* Show UserProductOverlay to the influencer */}
                    {isStreamer && selectedProducts && selectedProducts.length > 0 && (
                        <div className="absolute right-4 top-4 z-10">
                            <UserProductOverlay products={selectedProducts} influencerId={stream.influencerId} />
                        </div>
                    )}

                    {/* Show ProductOverlay to viewers */}
                    {!isStreamer && selectedProducts && selectedProducts.length > 0 && (
                        <div className="absolute right-4 top-4 z-10">
                            <ProductOverlay
                                products={selectedProducts}
                                ref={productOverlayRef}
                                influencerId={stream.influencerId}
                            />
                        </div>
                    )}
                    <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-4">
                            <Likes playbackId={stream.playbackId} />
                            <Views playbackId={stream.playbackId} />
                        </div>
                        {/* Show UserProductOverlay to the influencer */}
                        {isStreamer && (
                            <InfluencerFollowersCount influencerId={stream.influencerId} />
                        )}
                        {isStreamer && (
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<LocalOffer />}
                                onClick={() => setIsProductSelectionOpen(true)}
                                size="small"
                            >
                                Manage Product Ads
                            </Button>
                        )}
                    </div>
                </div>
                <LiveChat playbackId={stream.playbackId} />
            </div>

            {/* Display ordered products section below the video */}
            {!isStreamer && productOverlayRef.current?.orderedProducts?.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Ordered Products</h3>
                    <div id="ordered-products-container">
                        {productOverlayRef.current.orderedProducts.map((product, index) => (
                            <div key={index} className="p-2 border rounded mb-2">
                                <p>{product.name}</p>
                                <p>Price: ${product.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className='flex flex-row gap-4 mt-4'>
                <Quiz playbackId={stream.playbackId} streamId={streamId} />
                <Poll playbackId={stream.playbackId} streamId={streamId} />
            </div>

            <hr className='mt-4 h-px border-amber-500' />

            <StreamDetails
                streamId={streamId}
                streamKey={stream.streamKey}
                initialTitle={stream.name}
            />

            {isStreamer && (
                <ProductSelection
                    open={isProductSelectionOpen}
                    onClose={() => setIsProductSelectionOpen(false)}
                    onProductsSelect={handleProductsSelect}
                />
            )}


        </div>
    );
}

