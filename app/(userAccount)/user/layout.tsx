"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
  AppBar,
  useTheme,
  ListItemIcon,
} from "@mui/material";
import Header from "@/components/Header/DealersPanelHeader";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/firebase";
import { toast } from "react-toastify";
import { LoaderIcon } from "react-hot-toast";
import useOwnersStore from "@/store/dealersPanel/OwnersInfo";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
const drawerWidth = 240;
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { History } from "@mui/icons-material";
import "../mainstyle.css";
export default function DealerAdminPanel({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false); // To track auth check
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const { setinfo } = useOwnersStore();

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        try {
          const res = await getDoc(doc(db, "users", user.uid));
          setinfo({
            email: user.email!,
            name: res.data()!.name,
            uid: user.uid,
            contactDetails: res.data()!.contactDetails,
            vehicles: res.data()!.vehicles || [],
            interests: res.data()!.interests || [],
            notificationPreferences: res.data()!.notificationPreferences || {
              liveStream: false,
              newContent: false,
              recommendations: true,
              specialOffers: false,
            },
          });
          setIsLoggedIn(true);
          router.replace("/user/myAccount"); // Redirect to myAccount if logged in
        } catch (error) {
          // toast.error("Error fetching user data");
          console.error("Error fetching user data:", error);
        }
      } else {
        setIsLoggedIn(false);
        // toast.error("Unauthorized Email");
        router.replace("/Authenticate/SignIn"); // Redirect to SignIn if not logged in
      }
      setAuthChecked(true); // Mark the auth check as completed
      setLoading(false);
    });
  }, [setinfo, router]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const LogUserOut = async () => {
    await signOut(auth);
    setinfo({
      contactDetails: "",
      email: "",
      name: "",
      uid: "",
      vehicles: [],
    });
    router.replace("/"); // Redirect to home after logging out
  };

  const drawerContent = (
    <>
      <Toolbar>
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Arena Logo" width={120} height={40} />
        </Link>
      </Toolbar>
      <List className="flex flex-col items-center justify-center">
        <ListItem component={Link} href="/user/myAccount" sx={{ width: "90%" }}>
          <ListItemIcon>
            <DashboardIcon sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem component={Link} href="/user/Orders" sx={{ width: "90%" }}>
          <ListItemIcon>
            <ShoppingCartIcon sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="My Instream Orders" />
        </ListItem>
        <ListItem
          component={Link}
          href="/user/StoreOrders"
          sx={{ width: "90%" }}
        >
          <ListItemIcon>
            <ShoppingCartIcon sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="My Store Orders" />
        </ListItem>
        <ListItem
          component={Link}
          href="/user/WatchHistory"
          sx={{ width: "90%" }}
        >
          <ListItemIcon>
            <History sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="My Watch History" />
        </ListItem>
        <ListItem component={Link} href="/user/Profile" sx={{ width: "90%" }}>
          <ListItemIcon>
            <AccountCircleIcon sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem
          component={Link}
          href="#"
          sx={{ width: "90%" }}
          onClick={LogUserOut}
        >
          <ListItemIcon>
            <LogoutIcon sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </>
  );

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderIcon color="blue" className="!h-40 !w-40 !border-blue-500" />
      </div>
    );
  }

  return (
    isLoggedIn && (
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {/* AppBar for mobile screens */}
        <AppBar position="fixed" sx={{ display: { md: "none" } }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              My Account
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Permanent Drawer for larger screens */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              color: "white",
              background:
                "linear-gradient(130deg, #004d39 2%, #002d1f 7%, #000000 50%)",
              height: "100vh",
              overflowY: "auto",
              scrollbarWidth: "none", // For Firefox
              "&::-webkit-scrollbar": {
                display: "none", // For Chrome, Safari
              },
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Temporary Drawer for mobile screens */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              color: "white",
              background:
                "linear-gradient(130deg, #004d39 2%, #002d1f 7%, #000000 50%)",
              height: "100vh",
              overflowY: "auto",
              scrollbarWidth: "none", // For Firefox
              "&::-webkit-scrollbar": {
                display: "none", // For Chrome, Safari
              },
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Main content */}
        <Box
          component="main"
          sx={{ flexGrow: 1, backgroundColor: "black", mt: { xs: 8, md: 0 } }}
        >
          <Header />
          {children}
        </Box>
      </Box>
    )
  );
}
