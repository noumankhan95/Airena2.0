"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { toast } from "react-toastify";
import { DeleteIcon } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  email: string;
  platform: string;
  referral: string;
  channelDescription: string;
  sportGame: string;
  mobile: string;
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [filteredPartners, setfilteredPartners] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    fetchPartners();
  }, []);

  async function fetchPartners() {
    setLoading(true);
    try {
      const partnersCollection = collection(db, "becomePartners");
      const snapshot = await getDocs(partnersCollection);

      const partners = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPartners(partners);
    } catch (error) {
      //@ts-ignore
      toast.error(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    setfilteredPartners(
      partners?.filter((seller: any) => {
        const query = searchQuery.toLowerCase();
        return (
          seller.businessName?.toLowerCase().includes(query) ||
          seller.email?.toLowerCase().includes(query) ||
          seller.storeName?.toLowerCase().includes(query)
        );
      })
    );
  }, [searchQuery, partners]);
  const handleViewDetails = (partner: Partner) => {
    setSelectedPartner(partner);
    setEmail(partner.email);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPartner(null);
    setEmail("");
    setPassword("");
  };

  const handleRejectRequest = async (id: string) => {
    if (!confirm("Are you sure you want to reject this request?")) return;

    try {
      await deleteDoc(doc(db, "becomePartners", id));
      setPartners((prev) => prev.filter((partner) => partner.id !== id));
    } catch (error) {
      toast.error("Error rejecting request:");
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
      <Typography variant="h5" gutterBottom>
        Partner Requests
      </Typography>

      {loading ? (
        <CircularProgress className="mx-auto" />
      ) : partners.length === 0 ? (
        <Typography>No partner requests found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                <TableCell>
                  <strong>Mobile</strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPartners?.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell>{partner.name}</TableCell>
                  <TableCell>{partner.email}</TableCell>
                  <TableCell>{partner.mobile}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleViewDetails(partner)}
                    >
                      View Details
                    </Button>
                    &nbsp;
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleRejectRequest(partner.id)}
                      startIcon={<DeleteIcon />}
                    >
                      Reject Request
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal for View Details */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Partner Details</DialogTitle>
        <DialogContent>
          {selectedPartner && (
            <>
              <Typography>
                <strong>Name:</strong> {selectedPartner.name}
              </Typography>
              <Typography>
                <strong>Email:</strong> {selectedPartner.email}
              </Typography>
              <Typography>
                <strong>Mobile:</strong> {selectedPartner.mobile}
              </Typography>
              <Typography>
                <strong>Platform:</strong> {selectedPartner.platform}
              </Typography>
              <Typography>
                <strong>Referral:</strong> {selectedPartner.referral}
              </Typography>
              <Typography>
                <strong>Sport/Game:</strong> {selectedPartner.sportGame}
              </Typography>
              <Typography>
                <strong>Channel Description:</strong>{" "}
                {selectedPartner.channelDescription}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
