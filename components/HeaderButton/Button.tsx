"use client";
import { auth, db } from "@/firebase";
import useOwnersStore from "@/store/dealersPanel/OwnersInfo";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
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
      href={uid ? "/user/myAccount" : "/user/SignIn"}
      className="border border-green-500/70 text-white px-6 py-2 rounded-md hover:bg-green-500/10 transition duration-300"
    >
      {uid ? "My Account" : "Login"}
    </Link>
  );
}

export default HeaderButton;
