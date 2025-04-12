"use client";
import { useState, useEffect } from "react";
import { db } from "@/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const AdminPercentageLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const q = query(
        collection(db, "percentage_logs"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);

      //@ts-ignore
      setLogs(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchLogs();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">
        Influencer Percentage Logs
      </h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Vendor</TableCell>
            <TableCell>Influencer</TableCell>
            <TableCell>Percentage</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Timestamp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log: any) => (
            <TableRow key={log.id}>
              <TableCell>
                <div>
                  <p className="font-semibold">{log.vendorName}</p>
                  <p className="text-sm text-gray-500">{log.vendorEmail}</p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-semibold">{log.influencerName}</p>
                  <p className="text-sm text-gray-500">{log.influencerEmail}</p>
                </div>
              </TableCell>
              <TableCell className="font-semibold">{log.percentage}%</TableCell>
              <TableCell
                className={
                  log.status === "Approved"
                    ? "text-green-500"
                    : log.status === "Rejected"
                    ? "text-red-500"
                    : "text-yellow-500"
                }
              >
                {log.status}
              </TableCell>
              <TableCell>
                {new Date(log.timestamp?.seconds * 1000).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminPercentageLogs;
