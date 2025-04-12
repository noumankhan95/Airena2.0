"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
} from "@mui/material";
import useOwnersStore from "@/store/dealersPanel/OwnersInfo";

interface Stream {
  stream: {
    id: string;
    title: string;
    createdAt: string;
    category: string;
    totalViews: number;
    isActive: boolean;
  };
  watchedAt?: any;
}

export default function UserHistoryTable() {
  const {
    info: { uid },
  } = useOwnersStore();
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserHistory = async () => {
      try {
        const userHistoryDoc = await getDoc(doc(db, "UserHistory", uid));
        if (userHistoryDoc.exists()) {
          const data = userHistoryDoc.data();
          setStreams(data.streams || []);
        }
      } catch (error) {
        console.error("Error fetching user history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (uid) {
      fetchUserHistory();
    }
  }, [uid]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (streams.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No streams found.</div>
    );
  }
  console.log(streams, "wath history");
  return (
    <Box>
      <TableContainer component={Paper} className="mt-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Title</strong>
              </TableCell>
              <TableCell>
                <strong>Category</strong>
              </TableCell>
              <TableCell>
                <strong>Created At</strong>
              </TableCell>
              <TableCell>
                <strong>Wached At</strong>
              </TableCell>
              {/* <TableCell>
                <strong>Total Views</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {streams?.map((stream) => (
              <TableRow key={stream.stream.id}>
                <TableCell>{stream.stream.title}</TableCell>
                <TableCell>{stream.stream.category}</TableCell>
                <TableCell>
                  {new Date(stream?.stream.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(stream?.watchedAt).toLocaleString()}
                </TableCell>
                {/* <TableCell>{stream.stream.totalViews}</TableCell>
                <TableCell>
                  {stream.stream.isActive ? "Live" : "Ended"}
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
