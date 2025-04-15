"use client";
import { useEffect, useState } from "react";
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
  ListItemIcon,
} from "@mui/material";
import Image from "next/image";

import MenuIcon from "@mui/icons-material/Menu"; // Material-UI hamburger icon
import Header from "@/components/Header/DealersPanelHeader";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase";
import { toast } from "react-toastify";
import { LoaderIcon } from "react-hot-toast";
import { signOut } from "firebase/auth";
import useAdminOwnerStore from "@/store/adminPanel/AdminOwnersInfo";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import StoreIcon from "@mui/icons-material/Store";
import PeopleIcon from "@mui/icons-material/People";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import LogoutIcon from "@mui/icons-material/Logout";
import ArticleIcon from "@mui/icons-material/Article";
import "./mainstyle.css";
import { Email } from "@mui/icons-material";
const drawerWidth = 270;

export default function DealerAdminPanel({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);
  const [mobileOpen, setMobileOpen] = useState(false); // State for mobile drawer
  const router = useRouter();
  const { setinfo } = useAdminOwnerStore();
  const [authChecked, setAuthChecked] = useState<boolean>(false); // To track auth check

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      try {
        setLoading(true);
        if (user) {
          const tokenResult = await user.getIdTokenResult();
          if (!tokenResult.claims.admin) throw "Unauthorized";
          setIsAdmin(!!tokenResult.claims.admin);
          setinfo({ email: user.email!, name: "", uid: user.uid });
        } else {
          setIsAdmin(false);
          router.replace("/Authenticate/AdminPanel");
          toast.error("Unauthorized");
        }
      } catch (e) {
        setIsAdmin(false);
        toast.error("Unauthorized Email");
        router.replace("/Authenticate/AdminPanel");
      } finally {
        setLoading(false);
        setAuthChecked(true); // Mark the auth check as completed
      }
    });
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const drawerContent = (
    <>
      <Toolbar>
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Arena Logo" width={120} height={40} />
        </Link>
      </Toolbar>
      <List className="flex flex-col items-center justify-center">
        <ListItem
          component={Link}
          href="/adminPanel/create_admin"
          sx={{ width: "90%" }}
        >
          <ListItemIcon>
            <PersonAddIcon />
          </ListItemIcon>
          <ListItemText primary="Create Admin" />
        </ListItem>

        <ListItem
          component={Link}
          sx={{ width: "90%" }}
          href="/adminPanel/create_creator_account"
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Create Creator Account" />
        </ListItem>
        <ListItem
          component={Link}
          sx={{ width: "90%" }}
          href="/adminPanel/NewsLetter"
        >
          <ListItemIcon>
            <Email />
          </ListItemIcon>
          <ListItemText primary="NewsLetter" />
        </ListItem>
        <ListItem
          component={Link}
          sx={{ width: "90%" }}
          href="/adminPanel/createBrand"
        >
          <ListItemIcon>
            <StoreIcon />
          </ListItemIcon>
          <ListItemText primary="Create Brand Account" />
        </ListItem>

        <ListItem
          component={Link}
          sx={{ width: "90%" }}
          href="/adminPanel/partnerRequests"
        >
          <ListItemIcon>
            <RequestPageIcon />
          </ListItemIcon>
          <ListItemText primary="Partner Requests" />
        </ListItem>

        <ListItem
          component={Link}
          sx={{ width: "90%" }}
          href="/adminPanel/brandRequests"
        >
          <ListItemIcon>
            <RequestPageIcon />
          </ListItemIcon>
          <ListItemText primary="Brand Requests" />
        </ListItem>

        <ListItem
          component={Link}
          sx={{ width: "90%" }}
          href="/adminPanel/Percentage_Logs"
        >
          <ListItemIcon>
            <MonetizationOnIcon />
          </ListItemIcon>
          <ListItemText primary="Commission Logs" />
        </ListItem>

        <ListItem
          component={Link}
          sx={{ width: "90%" }}
          href="/adminPanel/manageCreators"
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Manage Creators" />
        </ListItem>

        <ListItem
          component={Link}
          sx={{ width: "90%" }}
          href="/adminPanel/manageBrands"
        >
          <ListItemIcon>
            <StoreIcon />
          </ListItemIcon>
          <ListItemText primary="Manage Brands" />
        </ListItem>

        <ListItem
          component={Link}
          sx={{ width: "90%" }}
          href="/adminPanel/Add_Blog"
        >
          <ListItemIcon>
            <ArticleIcon />
          </ListItemIcon>
          <ListItemText primary="Add Blog" />
        </ListItem>

        <ListItem
          component={Link}
          sx={{ width: "90%" }}
          href="/adminPanel/Blogs"
        >
          <ListItemIcon>
            <ArticleIcon />
          </ListItemIcon>
          <ListItemText primary="View Blogs" />
        </ListItem>

        <ListItem
          component={Link}
          sx={{ width: "90%" }}
          href="#"
          onClick={async () => {
            await signOut(auth);
            router.replace("/");
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </>
  );

  return !authChecked || loading || isAdmin === undefined ? (
    <div className="flex items-center justify-center h-screen">
      <LoaderIcon color="blue" className="!h-40 !w-40 !border-blue-500" />
    </div>
  ) : (
    isAdmin && (
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <AppBar position="fixed" sx={{ display: { md: "none" } }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, background: "#203e32" }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Super Admin Panel
            </Typography>
          </Toolbar>
        </AppBar>

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
          className="hide-scrollbar"
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} // Improves performance on mobile
          sx={{
            display: { xs: "block", md: "none" },
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              color: "white",
              background:
                "linear-gradient(130deg, #004d39 2%, #002d1f 27%, #000000 50%)",
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

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            backgroundColor: "black",
            mt: { xs: 8, md: 0 }, // Adjust for AppBar height on mobile
          }}
        >
          {<Header />}
          {children}
        </Box>
      </Box>
    )
  );
}
