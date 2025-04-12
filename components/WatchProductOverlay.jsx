'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/firebase';
import ProductOverlay from './ProductOverlay';

export default function WatchProductOverlay({ streamData }) {
    const [products, setProducts] = useState(streamData?.selectedProducts || []);

    useEffect(() => {
        if (!streamData?.influencerId || !streamData?.streamId) return;

        const unsubscribe = onSnapshot(
            doc(db, 'streams', streamData.influencerId),
            (docSnapshot) => {
                if (!docSnapshot.exists()) return;

                const data = docSnapshot.data();
                if (data?.[streamData.streamId]?.selectedProducts) {
                    setProducts(data[streamData.streamId].selectedProducts);
                }
            },
            (error) => {
                console.error("Error listening to product changes:", error);
            }
        );

        return () => unsubscribe();
    }, [streamData?.influencerId, streamData?.streamId]);

    if (!products || products.length === 0) return null;

    return <ProductOverlay products={products} influencerId={streamData?.influencerId} />;
}  