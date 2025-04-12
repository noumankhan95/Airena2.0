"use client";
import {
  darkTheme,
  grassyTheme,
  lightTheme,
  defaultTheme,
  FigmaTheme,
} from "@/extra/theme";
import { requestNotificationPermission } from "@/lib/firebase";
import useThemeStore from "@/store/Themestore";
import { Button, CssBaseline, type Theme } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import Script from "next/script";
import { useEffect, useState } from "react";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = useThemeStore();
  // const [queryClient] = useState(() => new QueryClient());
  const getTheme = () => {
    switch (theme) {
      case "dark":
        return darkTheme;
      case "grassy":
        return grassyTheme;
      case "light":
        return lightTheme;
      case "Figma":
        return FigmaTheme;
      default:
        return defaultTheme;
    }
  };

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && typeof navigator !== undefined) {
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker
            .register("/firebase-messaging-sw.js")
            .then((registration) => {
              console.log("Service Worker registered:", registration);
            })
            .catch((err) =>
              console.log("Service Worker registration failed:", err)
            );
        }
      }
    } catch (e) {
      console.log(e);
    }
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined" && typeof navigator !== undefined)
      getPermission();
  }, []);

  async function getPermission() {
    const token = await requestNotificationPermission();
    if (token) {
      console.log(`Subscribed to influencer_`, token);
    }
  }
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  useEffect(() => {
    //@ts-ignore
    window.fbAsyncInit = function () {
      //@ts-ignore

      FB.init({
        xfbml: true,
        version: "v12.0",
      });
    };

    (function (d, s, id) {
      let js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      //@ts-ignore

      js.src =
        "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v22.0";
      //@ts-ignore

      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);
  useEffect(() => {
    if (!document.getElementById("reddit-embed-script")) {
      const script = document.createElement("script");
      script.src = "https://embed.reddit.com/widgets.js";
      script.id = "reddit-embed-script";
      script.async = true;
      document.body.appendChild(script);
    } else {
      setTimeout(() => {
        // Force reloading existing Reddit embeds
        //@ts-ignore
        window.__embedly__?.process();
      }, 500);
    }
  }, []);

  return (
    // <QueryClientProvider client={queryClient}>
    <>
      <ThemeProvider theme={getTheme()}>{children}</ThemeProvider>
    </>
    // </QueryClientProvider>
  );
}
