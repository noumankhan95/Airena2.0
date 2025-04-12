importScripts(
  "https://www.gstatic.com/firebasejs/10.7.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBHXcD6u3DGxsfoelHAf_kZIacedTyVzVE",
  authDomain: "airena-50086.firebaseapp.com",
  projectId: "airena-50086",
  storageBucket: "airena-50086.firebasestorage.app",
  messagingSenderId: "864726257359",
  appId: "1:864726257359:web:c833d6813b8ced19a071ba",
});
  34
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background notification:", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.icon,
  });
});
