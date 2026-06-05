"use client";

import { useRouter } from "next/navigation";

export default function ViewButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/orders")}
      style={{
        padding: "12px 20px",
        background: "rgba(15, 23, 42, 0.9)",
        color: "#e2e8f0",
        border: "1px solid rgba(148, 163, 184, 0.2)",
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: 600,
        cursor: "pointer",
        backdropFilter: "blur(8px)",
        transition: "all 0.2s ease",
        boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      View Orders →
    </button>
  );
}