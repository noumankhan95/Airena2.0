"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ChatIcon from "@mui/icons-material/Chat";
import DescriptionIcon from "@mui/icons-material/Description";
import PercentIcon from "@mui/icons-material/Percent";
import InventoryIcon from "@mui/icons-material/Inventory";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { ListItemIcon } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Header from "@/components/Header/DealersPanelHeader";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/firebase";
import { toast } from "react-toastify";
import { LoaderIcon } from "react-hot-toast";
import useOwnersStore from "@/store/dealersPanel/OwnersInfo";
import { doc, getDoc } from "firebase/firestore";
import "./mainstyle.css";
import useVendorstore from "@/store/vendorPanel/VendorsInfo";
import Image from "next/image";
import "./mainstyle.css";
import { Shop, ShopTwo } from "@mui/icons-material";

const drawerWidth = 240;

export default function DealerAdminPanel({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const { setinfo } = useVendorstore();
  const [authChecked, setAuthChecked] = useState<boolean>(false); // To track auth check

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      try {
        setLoading(true);
        if (user) {
          const tokenResult = await user.getIdTokenResult();
          console.log("tokenresult", tokenResult);

          if (!tokenResult.claims.vendor) throw "Unauthorized";
          console.log("JEre in layout", user);
          const res = await getDoc(doc(db, "vendors", user.uid));
          setinfo({
            email: user.email!,
            name: res.data()!.name,
            uid: user.uid,
            contactDetails: res.data()!.contactDetails,
          });
          // router.replace("/BrandPanel/Settings");
          setIsAdmin(!!tokenResult.claims.vendor);
        } else {
          setIsAdmin(false);
          router.replace("/Authenticate/BrandPanel");
        }
      } catch (e) {
        console.log(e);
        setIsAdmin(false);
        toast.error("Unauthorized Email");
        router.replace("/Authenticate/BrandPanel");
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
    <>
      <Toolbar>
        <Link href="/BrandPanel" className="flex items-center">
          <Image src="/logo.png" alt="Arena Logo" width={120} height={40} />
        </Link>
      </Toolbar>
      <List className="flex flex-col items-center justify-center">
        <ListItem component={Link} href="/BrandPanel" sx={{ width: "90%" }}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem
          component={Link}
          href="/BrandPanel/Add_Product"
          sx={{ width: "90%" }}
        >
          <ListItemIcon>
            <AddBoxIcon />
          </ListItemIcon>
          <ListItemText primary="Add Product" />
        </ListItem>
        <ListItem
          component={Link}
          href="/BrandPanel/Chat"
          sx={{ width: "90%" }}
        >
          <ListItemIcon>
            <ChatIcon />
          </ListItemIcon>
          <ListItemText primary="Chat" />
        </ListItem>
        {/* <ListItem
          component={Link}
          href="/BrandPanel/Agreement"
          sx={{ width: "90%" }}
        >
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText primary="Agreement" />
        </ListItem> */}
        <ListItem
          component={Link}
          href="/BrandPanel/Percentages"
          sx={{ width: "90%" }}
        >
          <ListItemIcon>
            <PercentIcon />
          </ListItemIcon>
          <ListItemText primary="Commission" />
        </ListItem>
        <ListItem
          component={Link}
          href="/BrandPanel/Manage_products"
          sx={{ width: "90%" }}
        >
          <ListItemIcon>
            <InventoryIcon />
          </ListItemIcon>
          <ListItemText primary="Manage Products" />
        </ListItem>
        <ListItem
          component={Link}
          href="/BrandPanel/InStreamOrders"
          sx={{ width: "90%" }}
        >
          <ListItemIcon>
            <ShopTwo />
          </ListItemIcon>
          <ListItemText primary="Instream Orders" />
        </ListItem>
        <ListItem
          component={Link}
          href="/BrandPanel/StoreOrders"
          sx={{ width: "90%" }}
        >
          <ListItemIcon>
            <Shop />
          </ListItemIcon>
          <ListItemText primary="Store Orders" />
        </ListItem>
        {/* <ListItem
          component={Link}
          href="/BrandPanel/Settings"
          sx={{ width: "90%" }}
        >
          <ListItemIcon>
            <SettingsIcon />
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
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </>
  );

  return loading ? (
    <div className="flex items-center justify-center h-screen">
      <LoaderIcon color="blue" className="!h-40 !w-40 !border-blue-500" />
    </div>
  ) : (
    isAdmin && (
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
              Vendor Panel
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
          sx={{
            flexGrow: 1,
            mt: { xs: 8, md: 0 },
          }}
        >
          <Header />
          {children}
        </Box>
      </Box>
    )
  );
}
