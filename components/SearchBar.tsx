"use client";

import {
  TextField,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import ReactPlayer from "react-player";
import { SearchIcon } from "lucide-react";

export default function SearchBar() {
  const [streams, setStreams] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<any[]>([]);
  const [selectedStream, setSelectedStream] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchStreams = async () => {
      const savedStreamsRef = collection(db, "savedStreams");
      const snapshot = await getDocs(savedStreamsRef);

      let all: any[] = [];
      snapshot.forEach((doc) => {
        const userStreams = doc.data().streams || [];
        all = [...all, ...userStreams];
      });

      setStreams(all);
    };

    fetchStreams();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFiltered([]);
      return;
    }

    const matches = streams
      ?.filter(
        (s) =>
          s?.visibility === "public" &&
          s?.title?.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 10); // Only top 10

    setFiltered(matches);
  }, [search, streams]);

  const handleClick = (stream: any) => {
    setSelectedStream(stream);
    setVideoUrl(stream.videoURL);
    setSearch("");
    setFiltered([]);
  };

  return (
    <div className="relative w-full max-w-md mx-auto text-white">
      <TextField
        variant="outlined"
        size="small"
        placeholder="Search streams..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        InputProps={{ style: { fontSize: 14 }, endAdornment: <SearchIcon /> }}
      />

      {/* Suggestions */}
      {filtered.length > 0 && (
        <List className="absolute w-full  text-black z-50 shadow-md max-h-64 overflow-auto rounded-md">
          {filtered.map((stream) => (
            <ListItem
              key={stream.title}
              component={"li"}
              onClick={() => handleClick(stream)}
              className="cursor-pointer"
            >
              <ListItemText
                primary={stream.title}
                secondary={"By " + stream.name || ""}
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Video Modal */}
      <Dialog
        open={Boolean(selectedStream)}
        onClose={() => {
          setSelectedStream(null);
          setVideoUrl(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogContent className="bg-black">
          <Typography variant="h6" className="text-white mb-2">
            {selectedStream?.title}
          </Typography>
          {videoUrl ? (
            <div className="aspect-w-16 aspect-h-9 w-full">
              <ReactPlayer
                url={videoUrl}
                controls
                width="100%"
                height="100%"
                playing
              />
            </div>
          ) : (
            <Typography className="text-white">Loading video...</Typography>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
