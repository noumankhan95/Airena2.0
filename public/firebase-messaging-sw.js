importScripts(
  "https://www.gstatic.com/firebasejs/10.7.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDNRRMi2h9XFQIgk7a8LH1em8jzDzsezPI",
  authDomain: "airena-1909e.firebaseapp.com",
  projectId: "airena-1909e",
  storageBucket: "airena-1909e.firebasestorage.app",
  messagingSenderId: "1044298914811",
  appId: "1:1044298914811:web:c5366286cc2793e71f495e",
});
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background notification:", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.icon,
  });
});
