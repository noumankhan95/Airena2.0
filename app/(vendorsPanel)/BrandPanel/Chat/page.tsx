"use client";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  getDocs,
  where,
  query,
  onSnapshot,
} from "firebase/firestore";
import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { db, storage } from "@/firebase";

import useVendorstore from "@/store/vendorPanel/VendorsInfo";

export default function Chat() {
  const {
    info: { uid },
  } = useVendorstore(); // Get current user
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [image, setImage] = useState(null);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const fetchVendors = async () => {
      const vendorCollection = collection(db, "influencers");
      const vendorSnapshot = await getDocs(vendorCollection);
      setVendors(
        //@ts-ignore
        vendorSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setFilteredVendors(
        //@ts-ignore

        vendorSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };
    fetchVendors();
  }, []);

  useEffect(() => {
    if (!uid || !selectedVendor) return;

    const chatId =
      //@ts-ignore

      uid < selectedVendor.id
        ? //@ts-ignore

          `${uid}_${selectedVendor.id}`
        : //@ts-ignore

          `${selectedVendor.id}_${uid}`;

    const chatDocRef = doc(db, "messages", chatId);

    const unsubscribe = onSnapshot(chatDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setMessages(docSnapshot.data().messages || []);
      } else {
        setMessages([]); // No chat history yet
      }
    });

    return () => unsubscribe();
  }, [uid, selectedVendor]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setFilteredVendors(
      //@ts-ignore
      vendors?.filter(
        (vendor: any) =>
          vendor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vendor.email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, vendors]);
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        // alert("Pressed");
        sendMessage();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [newMessage, image, uid, selectedVendor]);
  const sendMessage = async () => {
    try {
      setLoading(true);
      if (!newMessage.trim() && !image) return;
      //@ts-ignore
      const chatId = [uid, selectedVendor.id].sort().join("_"); // Unique ID for chat
      const chatDocRef = doc(db, "messages", chatId);

      let imageUrl = "";
      if (image) {
        const imageRef = ref(storage, `chat_images/${uuidv4()}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      const newChatMessage = {
        text: newMessage,
        sender: uid,
        //@ts-ignore
        receiver: selectedVendor.id,
        imageUrl,
        timestamp: Date.now(), // Use a timestamp Firestore supports inside arrays
      };

      await setDoc(
        chatDocRef,
        { messages: arrayUnion(newChatMessage) }, // Append new message
        { merge: true } // Prevent overwriting existing data
      );
      setNewMessage("");
      setImage(null);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Box>
      <TextField
        label="Search By Name or Id"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ margin: "16px", width: 480 }}
      />
      <Box className="flex h-screen bg-black text-white">
        {/* Sidebar */}
        <div className="w-1/4 p-4 border-r">
          <Typography variant="h6">Creators</Typography>
          {filteredVendors?.map((vendor: any) => (
            <div
              key={vendor.id}
              onClick={() => setSelectedVendor(vendor)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 16px",
                cursor: "pointer",
                borderRadius: "8px",
                backgroundColor:
                  //@ts-ignore
                  selectedVendor?.id === vendor.id ? "#38a169" : "",
                //@ts-ignore

                color: selectedVendor?.id === vendor.id ? "white" : "",
                transition: "background-color 0.3s ease, color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                //@ts-ignore

                if (selectedVendor?.id !== vendor.id) {
                  e.currentTarget.style.backgroundColor = "#348f76"; // mint-darker on hover
                }
              }}
              onMouseLeave={(e) => {
                //@ts-ignore

                if (selectedVendor?.id !== vendor.id) {
                  e.currentTarget.style.backgroundColor = ""; // Remove the hover color when mouse leaves
                }
              }}
              className="my-2"
            >
              <Typography color="inherit">{vendor.name}</Typography>
            </div>
          ))}
        </div>

        {/* Chat Window */}
        <div className="flex flex-col w-3/4 p-4 my-1">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((msg: any, index: number) => (
              <div
                key={index}
                className={`max-w-xs p-3 rounded-lg flex flex-col ${
                  msg.sender === uid ? "ml-auto self-end" : "mr-auto"
                }`}
                style={{
                  backgroundColor: msg.sender === uid ? "white" : "#46c190",
                  color: msg.sender === uid ? "black" : "white",
                }}
              >
                {msg.text && <p>{msg.text}</p>}

                {msg.timestamp && (
                  <p style={{ color: msg.sender === uid ? "gray" : "white" }}>
                    {new Date(msg.timestamp)?.toLocaleDateString() +
                      "  " +
                      new Date(msg.timestamp)?.toLocaleTimeString()}
                  </p>
                )}
                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="attachment"
                    className="mt-2 max-w-full rounded-lg"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Chat Input - Always at the bottom */}
          <div
            className="flex items-center p-2 border-t space-x-2"
            style={{
              position: "sticky",
              bottom: 0,
              backgroundColor: "#0b0b0b",
              zIndex: 10,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              sx={{ backgroundColor: "#0b0b0b !important" }}
            />
            <Button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-lg ${
                loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-500"
              }`}
              onClick={sendMessage}
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div>
              ) : (
                "Send"
              )}
            </Button>
          </div>
        </div>
      </Box>
    </Box>
  );
}
