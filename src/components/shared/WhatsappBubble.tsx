"use client";

import { FloatingWhatsApp } from "@dxkit-org/react-floating-whatsapp";
import { useTheme } from "next-themes";

export default function WhatsappBubble() {
  const { theme } = useTheme(); // "light" | "dark"

  return (
    <FloatingWhatsApp
      phoneNumber="2348149996145" // change to your real number
      accountName="Billions Homz"
      avatar="/logos/billions-whatsapp.jpg"
      statusMessage="Typically replies within 1 hour"
      chatMessage="Hello 👋 How can we assist you today?"
      placeholder="Type a message..."
      darkMode={theme === "dark"} // 🔥 Sync with your theme
      // allowClickAway
      allowEsc
      notification
      notificationDelay={30}
      buttonStyle={{
        backgroundColor: "#25D366",
        bottom: "20px",
        right: "20px", // 👈 bottom-left placement
        position: "fixed",
      }}
      chatboxStyle={{
        borderRadius: "30px",
      }}
    />
  );
}
