"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
import MenuIcon from "@mui/icons-material/Menu";
import Header from "@/components/Header/DealersPanelHeader";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/firebase";
import { toast } from "react-toastify";
import { LoaderIcon } from "react-hot-toast";
import useOwnersStore from "@/store/dealersPanel/OwnersInfo";
import { doc, getDoc } from "firebase/firestore";
import useInfluencersInfo from "@/store/influencerPanel/OwnersInfo";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import DescriptionIcon from "@mui/icons-material/Description";
import StreamIcon from "@mui/icons-material/Stream";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
const drawerWidth = 240;

export default function influencerPanel({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const [authChecked, setAuthChecked] = useState<boolean>(false); // To track auth check

  const { setProfile } = useInfluencersInfo();
  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      try {
        setLoading(true);
        if (user) {
          const tokenResult = await user.getIdTokenResult();
          if (!tokenResult.claims.influencer) throw "Unauthorized";
          const res = await getDoc(doc(db, "influencers", user.uid));
          console.log(res.data(), "testing the response data");
          setProfile({
            email: user.email!,
            name: res.data()?.name || "",
            uid: user.uid || "",
            bio: res.data()?.bio || "",
            category: res.data()?.category || "",
            instagram: res.data()?.instagram || "",
            twitter: res.data()?.twitter || "",
            username: res.data()?.username || "",
            youtube: res.data()?.youtube || "",
            channel: res.data()?.channel || "",
            estimatedEarnings: res.data()?.earnings || 0,
            profilePic: res.data()?.profilePic || "",
            followers: res.data()?.followers.length || 0,
          });

          setIsAdmin(!!tokenResult.claims.influencer);
        } else {
          setIsAdmin(false);
          router.replace("/CreatorPanel/Authenticate");
        }
      } catch (e) {
        setIsAdmin(false);
        toast.error("Unauthorized Email");
        router.replace("/CreatorPanel/Authenticate");
      } finally {
        setLoading(false);
        setAuthChecked(true); // Mark the auth check as completed
      }
    });
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  if (!authChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderIcon color="blue" className="!h-40 !w-40 !border-blue-500" />
      </div>
    );
  }
  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <List className="flex flex-col items-center justify-center">
        <Toolbar>
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="Arena Logo" width={120} height={40} />
          </Link>
        </Toolbar>
        <ListItem component={Link} href="/CreatorPanel" sx={{ width: "90%" }}>
          <ListItemIcon>
            <DashboardIcon style={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem
          component={Link}
          href="/CreatorPanel/live"
          sx={{ width: "90%" }}
        >
          <ListItemIcon>
            <LiveTvIcon style={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Go Live" />
        </ListItem>

        <ListItem
          component={Link}
          href="/CreatorPanel/UploadVideo"
          sx={{ width: "90%" }}
        >
          <ListItemIcon>
            <VideoLibraryIcon style={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Upload Video" />
        </ListItem>

        <ListItem
          component={Link}
          href="/CreatorPanel/Agreement"
          sx={{ width: "90%" }}
        >
          <ListItemIcon>
            <DescriptionIcon style={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Agreement" />
        </ListItem>

        <ListItem
          component={Link}
          href="/CreatorPanel/MyStreams"
          sx={{ width: "90%" }}
        >
          <ListItemIcon>
            <StreamIcon style={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="My Streams" />
        </ListItem>

        <ListItem
          component={Link}
          href="/CreatorPanel/Chat"
          sx={{ width: "90%" }}
        >
          <ListItemIcon>
            <ChatIcon style={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Chat" />
        </ListItem>

        <ListItem
          component={Link}
          href="/CreatorPanel/Profile"
          sx={{ width: "90%" }}
        >
          <ListItemIcon>
            <PersonIcon style={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>

        <ListItem
          component={Link}
          href="/CreatorPanel/Percentages"
          sx={{ width: "90%" }}
        >
          <ListItemIcon>
            <MonetizationOnIcon style={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Commission" />
        </ListItem>

        {/* <ListItem
          component={Link}
          href="/CreatorPanel/Settings"
          sx={{ width: "90%" }}
        >
          <ListItemIcon>
            <SettingsIcon style={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem> */}

        <ListItem
          component={Link}
          href="#"
          sx={{ width: "90%" }}
          onClick={async () => {
            await signOut(auth);
            router.replace("/");
          }}
        >
          <ListItemIcon>
            <ExitToAppIcon style={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid rgba(255, 255, 255, 0.2)",
          textAlign: "center",
          backgroundColor: "#001f16",
        }}
      >
        <Typography variant="body2" sx={{ color: "white" }}>
          Subscription Fee: <strong>0 INR</strong>
        </Typography>
      </Box>
    </Box>
  );

  return loading ? (
    <div className="flex items-center justify-center h-screen">
      <LoaderIcon color="blue" className="!h-40 !w-40 !border-blue-500" />
    </div>
  ) : isAdmin ? (
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
            Creator Admin Panel
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
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "black",
          mt: { xs: 8, md: 0 },
        }}
      >
        <Header />
        {children}
      </Box>
    </Box>
  ) : (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "black",
      }}
    >
      {children}
    </Box>
  );
}
