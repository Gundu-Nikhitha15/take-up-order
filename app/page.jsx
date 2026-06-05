import TakeUpOrderModal from "@/components/TakeUpOrderModal";
import ViewOrdersButton from "@/components/ViewOrdersButton";

export default function Home() {
  return (
    <div style={{ padding: "40px" }}>
      
      <h1>Dashboard</h1>

      <TakeUpOrderModal />

      <div style={{ marginTop: "20px" }}>
        <ViewOrdersButton />
      </div>

    </div>
  );
}