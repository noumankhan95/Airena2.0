"use client";
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import {
    Card,
    CardMedia,
    Typography,
    Button,
    Fade,
    Box,
    CircularProgress
} from '@mui/material';
import { ShoppingCart, CheckCircle, Cancel } from '@mui/icons-material';
import { auth, db } from '@/firebase';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { createPortal } from 'react-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { QRCodeSVG } from "qrcode.react";
import { toast } from 'react-toastify';
import { CircleChevronLeftIcon, CircleChevronRight } from 'lucide-react';

const ProductOverlay = forwardRef(({ products, influencerId }, ref) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [orderedProducts, setOrderedProducts] = useState([]);
    const [purchasedProductIds, setPurchasedProductIds] = useState([]);
    const [container, setContainer] = useState(null);
    const [processingOrders, setProcessingOrders] = useState({});
    const [checkoutUrl, setCheckoutUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const orderCompletionRef = useRef(null);
    const router = useRouter();
    const [showFadeInModal, setshowFadeInModal] = useState(true)
    useImperativeHandle(ref, () => ({
        orderedProducts
    }));

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user);
            if (user) {
                setCurrentUserId(user.uid);
                fetchPurchasedProducts(user.uid);
            } else {
                setCurrentUserId(null);
                setPurchasedProductIds([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchPurchasedProducts = async (userId) => {
        try {
            const orderRef = collection(db, "order");
            const q = query(orderRef, where("userId", "==", userId));
            const querySnapshot = await getDocs(q);
            const purchasedIds = [];
            querySnapshot.forEach((doc) => {
                const orders = doc.data().orders || [];
                orders.forEach(order => {
                    if (order.productId && !purchasedIds.includes(order.productId)) {
                        purchasedIds.push(order.productId);
                    }
                });
            });
            setPurchasedProductIds(purchasedIds);
        } catch (error) {
            console.error("Error fetching purchased products:", error);
        }
    };

    useEffect(() => {
        console.log(typeof window !== "undefined" && checkoutUrl && window.innerWidth < 768)
        if (typeof window !== "undefined" && checkoutUrl && window.innerWidth < 768) {
            console.log("opening same tab")
            window.open(checkoutUrl, "_blank", "width=500,height=800");
        }
    }, [checkoutUrl])




    useEffect(() => {
        setContainer(document.getElementById('ordered-products-container'));
    }, []);

    const handleBuyNow = async (product) => {
        try {
            setLoading(true);
            if (purchasedProductIds.includes(product.node.id)) {
                alert("You've already purchased this product!");
                return;
            }
            if (!isLoggedIn) {
                sessionStorage.setItem('pendingProduct', JSON.stringify(product));
                router.push('/Authenticate/SignIn');
                return;
            }
            setProcessingOrders((prev) => ({ ...prev, [product.node.id]: true }));
            setSelectedProduct(product);
            const res = await fetch('/api/checkout', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    VarId: product.variant.id,
                    uid: currentUserId,
                    infUid: influencerId,
                    vendor: product.vendor
                })
            });
            const { checkoutUrl, errors } = await res.json();
            if (checkoutUrl) {
                setCheckoutUrl(checkoutUrl);
            } else {
                console.error("Error fetching checkout URL:", errors);
                throw "An Error Occurred";
            }
        } catch (e) {
            toast.error("An Error Occurred");
        } finally {
            setLoading(false);
        }
    };

    const isProductPurchased = (productId) => {
        return purchasedProductIds.includes(productId);
    };

    const isProcessing = (productId) => {
        return processingOrders[productId] === true;
    };

    if (!products || products.length === 0) return null;

    return (
        <>
            {products.length > 0 && <Box
                sx={{
                    position: "absolute",
                    right: { xs: 8, md: 0 },
                    top: { xs: 1, md: 12 },
                    zIndex: 10,
                    width: 50, // <<< Make cards smaller on mobile
                    maxHeight: { xs: "95%", md: "70%" }, // <<< Don't take full height
                    overflowY: "auto", // <<< This makes ONLY products scrollable
                    p: checkoutUrl ? 2 : 0,
                    borderRadius: 1,
                }}
            >
                {!showFadeInModal && <CircleChevronLeftIcon onClick={() => setshowFadeInModal(true)} color='#46C190' className='opacity-90 hover:opacity-100 cursor-pointer' />}
                {showFadeInModal && <CircleChevronRight onClick={() => setshowFadeInModal(false)} color='#46C190' className='opacity-90 hover:opacity-100 cursor-pointer' />}

            </Box>}
            <Fade in={showFadeInModal}>
                <Box
                    sx={{
                        position: "absolute",
                        right: { xs: 8, md: 16 },
                        top: { xs: 25.5, md: 45 },
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: { xs: 0.2, md: 2 },
                        zIndex: 10,
                        width: { xs: 120, md: 180 }, // <<< Make cards smaller on mobile
                        maxHeight: { xs: "95%", md: "70%" }, // <<< Don't take full height
                        overflowY: "auto", // <<< This makes ONLY products scrollable
                        p: checkoutUrl ? 2 : 0,
                        backgroundColor: checkoutUrl ? "white" : "transparent",
                        borderRadius: 1,
                    }}
                >

                    {loading ? (
                        <Typography variant="body2">Loading checkout...</Typography>
                    ) : checkoutUrl ? (
                        <>
                            <Cancel
                                onClick={
                                    () => { setCheckoutUrl(""); }}
                                sx={{
                                    cursor: "pointer",
                                    fontSize: { xs: 18, md: 20 },
                                    color: "red",
                                    alignSelf: "flex-end",
                                }}
                            />
                            <QRCodeSVG value={checkoutUrl} size={150} level="Q" />
                            <Typography variant="caption" sx={{ mt: 1, color: "gray" }}>
                                Scan the QR code to proceed to checkout
                            </Typography>
                        </>
                    ) : (
                        <>
                            {products?.map((product) => {
                                const purchased = isProductPurchased(product.node.id);
                                return (
                                    <Card
                                        key={product.node.id}
                                        className="cursor-pointer transition-all"
                                        sx={{
                                            width: { xs: 120, md: 160 }, // <-- smaller on mobile
                                            backgroundColor: "black",
                                            padding: { xs: 0.2, md: 0 },
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            borderRadius: 0
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            image={product.node.images.edges[0]?.node.url}
                                            alt={product.variant.title}
                                            sx={{
                                                width: "100%",
                                                height: { xs: 50, md: 80 },
                                                objectFit: "cover",
                                                borderRadius: 1,
                                                mb: { xs: 0, md: 1 },
                                            }}
                                        />
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                fontWeight: "bold",
                                                color: "white",
                                                fontSize: { xs: "0.3rem", md: "0.8rem" },
                                                textAlign: "center",
                                            }}
                                        >
                                            {product.variant.title}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: "#4CAF50",
                                                fontWeight: "bold",
                                                fontSize: { xs: "0.3rem", md: "0.7rem" },
                                                textAlign: "center",
                                                my: 0.5,
                                            }}
                                        >
                                            ${product.variant.price}
                                        </Typography>

                                        {purchased ? (
                                            <Button
                                                fullWidth
                                                size="small"
                                                disabled
                                                sx={{
                                                    backgroundColor: "rgba(76, 175, 80, 0.3)",
                                                    color: "white",
                                                    fontSize: { xs: "0.2rem", md: "0.7rem" },
                                                    textTransform: "none",
                                                    py: { xs: 0.1, md: 0.5 },
                                                }}
                                            >
                                                Purchased
                                            </Button>
                                        ) : (
                                            <Button
                                                fullWidth
                                                size="small"
                                                onClick={() => handleBuyNow(product)}
                                                sx={{
                                                    backgroundColor: "#46c190",
                                                    color: "white",
                                                    fontSize: { xs: "0.5rem", md: "0.7rem" },
                                                    textTransform: "none",
                                                    py: { xs: 0.1, md: 0.5 },
                                                    "&:hover": { backgroundColor: "#45a049" },
                                                }}
                                            >
                                                Buy Now
                                            </Button>
                                        )}
                                    </Card>
                                );
                            })}
                        </>
                    )}
                </Box>
            </Fade>
            {container && orderedProducts.length > 0 &&
                createPortal(
                    <Box
                        sx={{
                            p: 2,
                            bgcolor: "rgba(0,0,0,0.7)",
                            borderRadius: 1,
                        }}
                    >
                        <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
                            Your Orders
                        </Typography>
                        <Box className="flex flex-wrap gap-2">
                            {orderedProducts.map((product, index) => (
                                <Card
                                    key={`${product.node.id}-${index}`}
                                    sx={{
                                        maxWidth: 120,
                                        bgcolor: "rgba(0,0,0,0.5)",
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="80"
                                        image={product.node.images.edges[0]?.node.url}
                                        alt={product.node.title}
                                    />
                                    <Box sx={{ p: 1 }}>
                                        <Typography variant="caption" sx={{ color: "white", fontWeight: "bold" }}>
                                            {product.node.title}
                                        </Typography>
                                    </Box>
                                </Card>
                            ))}
                        </Box>
                    </Box>,
                    container
                )}
        </>
    );
});

ProductOverlay.displayName = 'ProductOverlay';
export default ProductOverlay;
