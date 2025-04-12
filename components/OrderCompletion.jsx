"use client";
import React, { useState, useEffect } from "react";
import { CircularProgress, Typography, Box, Button } from "@mui/material";
import { doc, setDoc, getDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import useOwnersStore from "@/store/dealersPanel/OwnersInfo";

// Convert component to a custom hook
// export const useOrderCompletion = (product, onOrderPlaced) => {
//     const [loading, setLoading] = useState(false);
//     const [orderComplete, setOrderComplete] = useState(false);
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [currentUser, setCurrentUser] = useState(null);
//     const [shopifyUrl, setShopifyUrl] = useState("");
//     const [showCompletionDialog, setShowCompletionDialog] = useState(true);
//     const [error, setError] = useState(null);
//     const [orderSuccess, setOrderSuccess] = useState(false);
//     const router = useRouter();
//     const { info } = useOwnersStore();

//     // Reset states when product changes
//     useEffect(() => {
//         if (product && product.node && product.node.id) {
//             setLoading(false);
//             setOrderComplete(false);
//             setShowCompletionDialog(true);
//             setError(null);
//         }
//     }, [product?.node?.id]);

//     // Check authentication state
//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, async (user) => {
//             if (user) {
//                 setIsLoggedIn(true);

//                 // Verify if the user exists in the users collection (not influencers)
//                 const userDoc = await getDoc(doc(db, "users", user.uid));
//                 if (userDoc.exists()) {
//                     setCurrentUser({
//                         uid: user.uid,
//                         email: user.email,
//                         ...userDoc.data()
//                     });
//                 } else {
//                     console.error("User not found in users collection");
//                     // Don't redirect here, just set the state
//                     setIsLoggedIn(false);
//                     setCurrentUser(null);
//                 }
//             } else {
//                 setIsLoggedIn(false);
//                 setCurrentUser(null);
//                 // Remove the automatic redirect
//                 // router.push('/user/SignIn');
//             }
//         });

//         return () => unsubscribe();
//     }, [router]);

//     // Check if user has already purchased this product
//     const checkIfAlreadyPurchased = async (userId, productId) => {
//         try {
//             const orderDocRef = doc(db, "order", userId);
//             const orderDoc = await getDoc(orderDocRef);

//             if (orderDoc.exists()) {
//                 const orders = orderDoc.data().orders || [];
//                 return orders.some(order => order.productId === productId);
//             }

//             return false;
//         } catch (error) {
//             console.error("Error checking purchase history:", error);
//             return false;
//         }
//     };

//     const placeOrder = async () => {
//         // Reset states
//         setError(null);
//         setLoading(true);
//         setOrderComplete(false);
//         setOrderSuccess(false);
//         setShowCompletionDialog(true);

//         if (!isLoggedIn || !currentUser) {
//             console.error("User not logged in or user data not found");
//             setError("You must be logged in to place an order.");
//             setLoading(false);
//             return;
//         }

//         try {
//             // Get user ID from the store if available, otherwise use from auth
//             const userId = info.uid || currentUser.uid;

//             // Ensure we have a valid user ID
//             if (!userId) {
//                 throw new Error("Valid user ID not found");
//             }

//             // Check if user already purchased this product
//             const alreadyPurchased = await checkIfAlreadyPurchased(userId, product.node.id);
//             if (alreadyPurchased) {
//                 setError("You've already purchased this product!");
//                 setLoading(false);
//                 alert("You've already purchased this product!");
//                 return;
//             }

//             console.log("Placing order for user:", userId);

//             // Prepare line items for Shopify order
//             const lineItems = [{
//                 variant_id: product.node.variants.edges[0].node.id.replace('gid://shopify/ProductVariant/', ''),
//                 quantity: 1
//             }];

//             // Call the API route to place the order in Shopify
//             const response = await fetch('/api/user/placeOrder', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     customerEmail: currentUser.email,
//                     lineItems: lineItems
//                 }),
//             });

//             const responseData = await response.json();

//             if (!response.ok) {
//                 throw new Error(responseData.error || 'Failed to place order');
//             }

//             // create order on Cashfree
//             Cashfree.XClientId = process.env.NEXT_PUBLIC_XCLIENT_ID;
//             Cashfree.XClientSecret = process.env.NEXT_PUBLIC_XCLIENT_SECRET_KEY;
//             Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

//             const cashfreeRequestData = {
//                 "order_amount": "1",
//                 "order_currency": "INR",
//                 "customer_details": {
//                     "customer_id": "node_sdk_test",
//                     "customer_name": "",
//                     "customer_email": "example@gmail.com",
//                     "customer_phone": "9999999999"
//                 },
//                 "order_meta": {
//                     "return_url": "https://test.cashfree.com/pgappsdemos/return.php?order_id=order_123"
//                 },
//                 "order_note": ""
//             };

//             Cashfree.PGCreateOrder('2023-08-01', cashfreeRequestData).then((response) => {
//                 const cashfreeResponseData = response.data;
//                 if (onOrderPlaced) onOrderPlaced(cashfreeResponseData);
//             }).catch((error) => {
//                 console.error('Error setting up order request:', error.response.data);
//             })

//             // Get current date as ISO string (Firestore-safe format)
//             const currentDate = new Date().toISOString();

//             // Create order data with Shopify order ID
//             const orderData = {
//                 productTitle: product.node.title,
//                 productId: product.node.id,
//                 email: currentUser.email,
//                 timestamp: currentDate,
//                 orderDate: currentDate,
//                 status: "completed", // Mark as completed since it went through Shopify
//                 shopifyOrderId: responseData.order?.id || null
//             };

//             // Get reference to the user's order document
//             const orderDocRef = doc(db, "order", userId);

//             // Check if the document already exists
//             const orderDoc = await getDoc(orderDocRef);

//             if (orderDoc.exists()) {
//                 // If the document exists, update it by adding the new order to the orders array
//                 await updateDoc(orderDocRef, {
//                     orders: arrayUnion(orderData),
//                     lastUpdated: serverTimestamp()
//                 });
//             } else {
//                 // If the document doesn't exist, create it with an orders array
//                 await setDoc(orderDocRef, {
//                     userId: userId,
//                     orders: [orderData],
//                     lastUpdated: serverTimestamp()
//                 });
//             }

//             // Set success state
//             setOrderSuccess(true);

//             // Notify parent component that the order has been completed
//             if (onOrderPlaced) onOrderPlaced();

//             // Make sure we set order complete only after everything else is done
//             setOrderComplete(true);
//             setLoading(false);
//         } catch (error) {
//             console.error("Error placing order:", error);
//             setError("Error placing order: " + error.message);
//             setLoading(false);
//         }
//     };

//     const completeOnShopify = () => {
//         // Update order status in Firestore
//         const updateOrderStatus = async () => {
//             try {
//                 const userId = info.uid || currentUser?.uid;
//                 if (!userId) return;

//                 const orderDocRef = doc(db, "order", userId);
//                 const orderDoc = await getDoc(orderDocRef);

//                 if (orderDoc.exists()) {
//                     const orders = orderDoc.data().orders || [];

//                     // We need to handle the array update differently since we can't use arrayUnion for updates
//                     // Mark any orders with the matching productId as completed
//                     const updatedOrders = orders.map(order => {
//                         if (order.productId === product.node.id) {
//                             return { ...order, status: "completed_on_shopify" };
//                         }
//                         return order;
//                     });

//                     // Update the entire orders array
//                     await updateDoc(orderDocRef, {
//                         orders: updatedOrders,
//                         lastUpdated: serverTimestamp() // serverTimestamp is OK at the document level
//                     });
//                 }
//             } catch (error) {
//                 console.error("Error updating order status:", error);
//             }
//         };

//         // Hide the completion dialog
//         setShowCompletionDialog(false);

//         // Start the order status update process
//         updateOrderStatus();

//         // Open Shopify checkout in new tab
//         window.open(shopifyUrl, "_blank");
//     };

//     // Return the functions and UI components
//     return {
//         placeOrder,
//         orderUI: loading ? (
//             <Box sx={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 flexDirection: 'column',
//                 p: 3,
//                 bgcolor: 'rgba(0,0,0,0.8)',
//                 backdropFilter: 'blur(8px)',
//                 borderRadius: 2,
//                 border: '1px solid #4CAF50',
//                 boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
//             }}>
//                 <CircularProgress sx={{ color: '#4CAF50' }} />
//                 <Typography variant="body1" sx={{ mt: 2, color: 'white', fontWeight: 'bold' }}>
//                     Processing your order...
//                 </Typography>
//             </Box>
//         ) : error ? (
//             <Box sx={{
//                 p: 3,
//                 bgcolor: 'rgba(0,0,0,0.8)',
//                 borderRadius: 2,
//                 border: '1px solid #f44336',
//                 backdropFilter: 'blur(8px)',
//                 width: '300px'
//             }}>
//                 <Typography variant="h6" gutterBottom sx={{ color: '#f44336', fontWeight: 'bold' }}>
//                     Order Error
//                 </Typography>
//                 <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
//                     {error}
//                 </Typography>
//                 <Button
//                     fullWidth
//                     variant="contained"
//                     sx={{
//                         bgcolor: '#f44336',
//                         '&:hover': { bgcolor: '#d32f2f' },
//                         mb: 1
//                     }}
//                     onClick={() => setError(null)}
//                 >
//                     Dismiss
//                 </Button>
//             </Box>
//         ) : (orderComplete && showCompletionDialog) ? (
//             <Box sx={{
//                 p: 3,
//                 bgcolor: 'rgba(0,0,0,0.8)',
//                 borderRadius: 2,
//                 border: '1px solid #4CAF50',
//                 backdropFilter: 'blur(8px)',
//                 width: '300px'
//             }}>
//                 <Typography variant="h6" gutterBottom sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
//                     {orderSuccess ? "Order Placed Successfully!" : "Complete Your Purchase"}
//                 </Typography>
//                 <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
//                     {orderSuccess
//                         ? `Your order for ${product.node.title} has been successfully placed.`
//                         : `${product.node.title} has been added to your order. Click below to complete your purchase on Shopify.`
//                     }
//                 </Typography>
//                 <Button
//                     fullWidth
//                     variant="contained"
//                     sx={{
//                         bgcolor: '#4CAF50',
//                         '&:hover': { bgcolor: '#45a049' },
//                         mb: 1
//                     }}
//                     onClick={orderSuccess ? () => setShowCompletionDialog(false) : completeOnShopify}
//                 >
//                     {orderSuccess ? "Close" : "Complete Purchase on Shopify"}
//                 </Button>
//                 {!orderSuccess && (
//                     <Typography variant="caption" sx={{ color: '#aaa', display: 'block', textAlign: 'center' }}>
//                         You'll be redirected to Shopify's secure checkout
//                     </Typography>
//                 )}
//             </Box>
//         ) : null
//     };
// };

// Keep the original component for backward compatibility
const OrderCompletion = ({ product, onOrderPlaced }) => {
    return null;
};

export default OrderCompletion;