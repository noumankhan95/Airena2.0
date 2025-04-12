"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Modal,
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "@/firebase"; // Import Firebase config

const AdminSellersTable = () => {
  const [sellers, setSellers] = useState([]);
  const [open, setOpen] = useState(false);
  const [filteredSellers, setFilteredSellers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeller, setSelectedSeller] = useState<any>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [sellerToDelete, setSellerToDelete] = useState<any>(null);

  // Fetch sellers from Firestore
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "sellersRegistration")
        );
        const sellersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        //@ts-ignore
        setSellers(sellersList);
        setFilteredSellers(sellersList);
      } catch (error) {
        console.error("Error fetching sellers:", error);
      }
    };

    fetchSellers();
  }, []);
  useEffect(() => {
    setFilteredSellers(
      sellers?.filter((seller: any) => {
        const query = searchQuery.toLowerCase();
        return (
          seller.businessName?.toLowerCase().includes(query) ||
          seller.email?.toLowerCase().includes(query) ||
          seller.storeName?.toLowerCase().includes(query)
        );
      })
    );
  }, [searchQuery, sellers]);
  // Open modal with seller details

  //@ts-ignore

  const handleOpen = (seller) => {
    setSelectedSeller(seller);
    setOpen(true);
  };

  // Close modal
  const handleClose = () => {
    setOpen(false);
    setSelectedSeller(null);
  };

  // Open delete confirmation dialog

  //@ts-ignore

  const handleDeleteDialogOpen = (seller) => {
    setSellerToDelete(seller);
    setDeleteDialog(true);
  };

  // Close delete confirmation dialog
  const handleDeleteDialogClose = () => {
    setDeleteDialog(false);
    setSellerToDelete(null);
  };

  // Delete seller document & associated files
  const handleDeleteSeller = async () => {
    if (!sellerToDelete) return;

    try {
      // Delete associated files from Firebase Storage
      if (sellerToDelete.legalDocumentURL) {
        const legalDocRef = ref(storage, sellerToDelete.legalDocumentURL);
        await deleteObject(legalDocRef);
      }
      if (sellerToDelete.brandLogoURL) {
        const logoRef = ref(storage, sellerToDelete.brandLogoURL);
        await deleteObject(logoRef);
      }

      // Delete seller document from Firestore
      await deleteDoc(doc(db, "sellersRegistration", sellerToDelete.id));

      // Remove seller from state

      //@ts-ignore

      setSellers((prev) => prev.filter((s) => s.id !== sellerToDelete.id));

      // Close delete dialog
      handleDeleteDialogClose();
    } catch (error) {
      console.error("Error deleting seller:", error);
    }
  };

  return (
    <div className="p-4">
      <TextField
        label="Search by Name or Email"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: "16px" }}
      />
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Business Name</b>
              </TableCell>
              <TableCell>
                <b>Store Name</b>
              </TableCell>
              <TableCell>
                <b>GSTIN</b>
              </TableCell>
              <TableCell align="right">
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSellers?.map((seller: any) => (
              <TableRow key={seller.id}>
                <TableCell>{seller.businessName}</TableCell>
                <TableCell>{seller.storeName}</TableCell>
                <TableCell>{seller.gtinNumber}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => handleOpen(seller)}
                  >
                    Show Details
                  </Button>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteDialogOpen(seller)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Seller Details */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          {selectedSeller && (
            <>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                Seller Details
              </Typography>
              <Typography>
                <b>Business Name:</b> {selectedSeller?.businessName}
              </Typography>
              <Typography>
                <b>Email:</b> {selectedSeller?.email}
              </Typography>
              <Typography>
                <b>Address:</b> {selectedSeller?.address}
              </Typography>

              <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                Uploaded Files
              </Typography>
              {selectedSeller?.legalDocumentURL && (
                <Typography>
                  <b>Legal Document:</b>{" "}
                  <a
                    href={selectedSeller?.legalDocumentURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#007bff", textDecoration: "none" }}
                  >
                    View Document
                  </a>
                </Typography>
              )}
              {selectedSeller?.brandLogoURL && (
                <Box sx={{ mt: 1 }}>
                  <Typography>
                    <b>Brand Logo:</b>
                  </Typography>
                  <img
                    src={selectedSeller?.brandLogoURL}
                    alt="Brand Logo"
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      objectFit: "contain",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  />
                </Box>
              )}

              <Button
                sx={{ mt: 3, display: "block", mx: "auto" }}
                variant="contained"
                color="secondary"
                onClick={handleClose}
              >
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <b>{sellerToDelete?.businessName}</b>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteSeller}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminSellersTable;
