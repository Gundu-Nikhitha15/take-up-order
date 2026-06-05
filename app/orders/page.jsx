"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (!error) {
      setOrders(data || []);
    }
  };

  const thStyle = {
    border: "1px solid #ddd",
    padding: "10px",
    backgroundColor: "#f4f4f4",
    textAlign: "left",
  };

  const tdStyle = {
    border: "1px solid #ddd",
    padding: "10px",
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>All Orders</h1>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Service</th>
              <th style={thStyle}>Address</th>
              <th style={thStyle}>City</th>
              <th style={thStyle}>State</th>
              <th style={thStyle}>ZIP</th>
              <th style={thStyle}>Notes</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id}>
                  <td style={tdStyle}>{order.name}</td>
                  <td style={tdStyle}>{order.email}</td>
                  <td style={tdStyle}>{order.phone}</td>
                  <td style={tdStyle}>{order.service}</td>
                  <td style={tdStyle}>{order.address}</td>
                  <td style={tdStyle}>{order.city}</td>
                  <td style={tdStyle}>{order.state}</td>
                  <td style={tdStyle}>{order.zip}</td>
                  <td style={tdStyle}>{order.notes}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={tdStyle} colSpan="9">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}