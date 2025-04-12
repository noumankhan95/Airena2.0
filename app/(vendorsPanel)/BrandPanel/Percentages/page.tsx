"use client";
import { useState, useEffect } from "react";
import { db } from "@/firebase";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  serverTimestamp,
  addDoc,
  getDoc,
} from "firebase/firestore";
import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Modal,
  Box,
  Slider,
  Typography,
} from "@mui/material";
import useVendorstore from "@/store/vendorPanel/VendorsInfo";
import { toast } from "react-toastify";

const VendorInfluencerPercentage = () => {
  const {
    info: { uid: vendorId, name, email },
  } = useVendorstore();
  const [influencers, setInfluencers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null);
  const [percentage, setPercentage] = useState(5);

  useEffect(() => {
    const fetchInfluencers = async () => {
      const querySnapshot = await getDocs(collection(db, "influencers"));
      setInfluencers(
        //@ts-ignore
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };
    fetchInfluencers();
  }, []);

  const handleOpen = (influencer: any) => {
    setSelectedInfluencer(influencer);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedInfluencer(null);
    setPercentage(5);
  };

  const handleAssign = async () => {
    if (!selectedInfluencer) return;

    const percentageDocId = `${vendorId}_${selectedInfluencer.id}`;
    const percentageDocRef = doc(db, "percentages", percentageDocId);

    try {
      const percentageDoc = await getDoc(percentageDocRef);
      if (percentageDoc.exists()) {
        const existingData = percentageDoc.data();
        if (existingData.status === "Pending") {
          toast.info("Percentage assignment is pending approval.");
          return;
        }
        await addDoc(collection(db, "percentage_logs"), {
          vendorId,
          vendorName: name,
          vendorEmail: email,
          influencerId: selectedInfluencer.id,
          influencerName: selectedInfluencer.name,
          influencerEmail: selectedInfluencer.email,
          previousPercentage: existingData.percentage,
          newPercentage: percentage,
          status: "Pending",
          timestamp: serverTimestamp(),
        });
      }
      await setDoc(percentageDocRef, {
        vendorId,
        vendorName: name,
        vendorEmail: email,
        influencerId: selectedInfluencer.id,
        influencerName: selectedInfluencer.name,
        influencerEmail: selectedInfluencer.email,
        percentage,
        status: "Pending",
        timestamp: serverTimestamp(),
      });
      handleClose();
      toast.success("Percentage assigned successfully!");
    } catch (error) {
      toast.error("Error assigning percentage: " + error);
    }
  };

  return (
    <div className="p-4">
      <Typography variant="body1" className="text-2xl font-semibold mb-4">
        Assign Percentage to Creators
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {influencers.map((influencer: any) => (
            <TableRow key={influencer.id}>
              <TableCell>{influencer.name}</TableCell>
              <TableCell>{influencer.email}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => handleOpen(influencer)}
                >
                  Assign Percentage
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal open={open} onClose={handleClose}>
        <Box className="bg-black p-6 rounded-lg shadow-lg w-96 mx-auto mt-20">
          <Typography variant="body2" className="text-xl font-semibold">Assign Percentage</Typography>
          <Slider
            value={percentage}
            onChange={(e, newValue) => setPercentage(newValue as number)}
            min={5}
            max={80}
            step={1}
            valueLabelDisplay="auto"
          />
          <div className="!mt-4 !space-x-4 flex justify-end">
            <Button onClick={handleClose} className="mr-2">
              Cancel
            </Button>
            <Button variant="contained" onClick={handleAssign}>
              Confirm
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default VendorInfluencerPercentage;
