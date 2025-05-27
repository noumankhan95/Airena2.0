//@ts-ignore
import { getToken, messaging, onMessage } from "@/firebase";

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification?.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied");
      return null;
    }

    //@ts-ignore
    if (!messaging) return;
    console.log(messaging);
    const fcmToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_VAPID,
    });

    if (fcmToken) {
      console.log("FCM Token:", fcmToken);
      return fcmToken;
    } else {
      console.warn("No FCM token found");
      return null;
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

// Handle notifications when the app is in foreground

// //@ts-ignore
// onMessage(messaging, (payload) => {
//   console.log("Message received:", payload);
// });
