"use client";
import { useState, useEffect } from "react";
import { db } from "@/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import useInfluencersInfo from "@/store/influencerPanel/OwnersInfo";

const InfluencerPercentageApproval = () => {
  const { uid: influencerId } = useInfluencersInfo();
  const [percentages, setPercentages] = useState([]);

  useEffect(() => {
    const fetchPercentages = async () => {
      const q = query(
        collection(db, "percentages"),
        where("influencerId", "==", influencerId)
      );
      const querySnapshot = await getDocs(q);

      setPercentages(
        //@ts-ignore
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    fetchPercentages();
  }, [influencerId]);

  const handleApproval = async (p: any, isApproved: boolean) => {
    const percentageDocRef = doc(db, "percentages", p.id);
    const status = isApproved ? "Approved" : "Rejected";

    // Update percentage status
    await updateDoc(percentageDocRef, {
      status,
      approvalTimestamp: serverTimestamp(),
    });

    // Log the action with full details
    await addDoc(collection(db, "percentage_logs"), {
      vendorId: p.vendorId,
      vendorName: p.vendorName,
      vendorEmail: p.vendorEmail,
      influencerId: influencerId,
      influencerName: p.influencerName,
      influencerEmail: p.influencerEmail,
      percentage: p.percentage,
      status,
      timestamp: serverTimestamp(),
    });

    // Update state to reflect change
    //@ts-ignore
    setPercentages((prev) =>
      //@ts-ignore

      prev.map((item) => (item.id === p.id ? { ...item, status } : item))
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">
        Influencer Percentage Approvals
      </h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Brand</TableCell>
            <TableCell>Percentage</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {percentages.map((p: any) => (
            <TableRow key={p.id}>
              <TableCell>
                <div>
                  <p className="font-semibold">{p.vendorName}</p>
                  <p className="text-sm text-gray-500">{p.vendorEmail}</p>
                </div>
              </TableCell>
              <TableCell className="font-semibold">{p.percentage}%</TableCell>
              <TableCell
                className={
                  p.status === "Approved"
                    ? "text-green-500"
                    : p.status === "Rejected"
                    ? "text-red-500"
                    : "text-yellow-500"
                }
              >
                {p.status}
              </TableCell>
              <TableCell>
                {p.status === "Pending" && (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      className="mr-2"
                      onClick={() => handleApproval(p, true)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleApproval(p, false)}
                    >
                      Disapprove
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InfluencerPercentageApproval;
