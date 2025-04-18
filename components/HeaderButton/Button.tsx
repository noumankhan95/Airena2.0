"use client";
import { auth, db } from "@/firebase";
import useOwnersStore from "@/store/dealersPanel/OwnersInfo";
import { Typography } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

function HeaderButton() {
  const {
    info: { uid, contactDetails, email, name },
    setinfo,
  } = useOwnersStore();
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

  return (
    <Link
      href={uid ? "/user/myAccount" : "/Authenticate/SignIn"}
      className="text-white rounded-full  hover:bg-green-500/10 transition duration-300"
    >
      <Typography
        sx={{
          color: "white",
          "&:hover": { color: "#46C190", backgroundColor: "transparent" },
          "&:visited": { color: "#46C190" },
          "&:focus": { color: "#46C190" },
        }}
      >
        <UserIcon className="w-6 h-6" />
      </Typography>
    </Link>
  );
}

export default HeaderButton;
