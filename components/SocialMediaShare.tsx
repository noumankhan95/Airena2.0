"use client";

import { IconButton, Tooltip } from "@mui/material";
import { Facebook, Twitter, LinkedIn, WhatsApp } from "@mui/icons-material";
import { useEffect, useState } from "react";

export default function ShareButtons() {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.href);
    }
  }, []);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`,
  };

  const openShareWindow = (shareUrl: string) => {
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  return (
    <div className="flex gap-2 mt-4">
      <Tooltip title="Share on Facebook">
        <IconButton
          onClick={() => openShareWindow(shareLinks.facebook)}
          color="primary"
        >
          <Facebook />
        </IconButton>
      </Tooltip>
      <Tooltip title="Share on Twitter">
        <IconButton
          onClick={() => openShareWindow(shareLinks.twitter)}
          color="primary"
        >
          <Twitter />
        </IconButton>
      </Tooltip>
      <Tooltip title="Share on LinkedIn">
        <IconButton
          onClick={() => openShareWindow(shareLinks.linkedin)}
          color="primary"
        >
          <LinkedIn />
        </IconButton>
      </Tooltip>
      <Tooltip title="Share on WhatsApp">
        <IconButton
          onClick={() => openShareWindow(shareLinks.whatsapp)}
          color="success"
        >
          <WhatsApp />
        </IconButton>
      </Tooltip>
    </div>
  );
}
