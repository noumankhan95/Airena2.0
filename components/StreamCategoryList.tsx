"use client";
import { auth, db } from "@/firebase";
import useOwnersStore from "@/store/dealersPanel/OwnersInfo";
import { Typography } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { RadioIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

function StreamCategoryList({ groupedStreams }: any) {
  const {
    info: { uid, contactDetails, email, name },
    setinfo,
  } = useOwnersStore();
  console.log("In the catefory list");
  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          console.log("User");
          const res = await getDoc(doc(db, "users", user.uid));
          setinfo({
            email: user.email!,
            name: res.data()!.name,
            uid: user.uid,
            contactDetails: res.data()!.contactDetails,
            vehicles: res.data()!.vehicles || [],
          });
        }
      } catch (e) {}
    });
  }, []);
  return Object.keys(groupedStreams).map((category) => (
    <div
      key={`streams-${category}`}
      id={`streams-${category}`}
      className="hidden mt-6 bg-gray-800/30 rounded-xl p-4"
    >
      <Typography
        variant="h5"
        component="div"
        sx={{ fontWeight: "bold", color: "#FBBF24", marginBottom: "1rem" }}
      >
        {category} Streams
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groupedStreams[category] && groupedStreams[category].length > 0 ? (
          groupedStreams[category].map((stream: any) => {
            console.log(stream, "ERerere");
            return (
              <Link
                href={`/watch/${stream.playbackId}`}
                key={stream.id}
                className="block p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700 transition duration-300"
              >
                <div className="flex items-center gap-3">
                  {stream.isActive ? (
                    <RadioIcon className="text-red-600 w-6 h-6" />
                  ) : (
                    <RadioIcon className="text-slate-400 w-6 h-6" />
                  )}
                  <div className="flex flex-col">
                    <h3 className="text-lg font-medium text-white">
                      {stream.title}
                    </h3>
                    <p className="text-sm text-slate-300">{stream.category}</p>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <p className="text-gray-400 italic col-span-full text-center py-4">
            No live streams available in this category.
          </p>
        )}
      </div>
    </div>
  ));
}

export default StreamCategoryList;
