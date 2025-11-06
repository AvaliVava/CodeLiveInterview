"use client"; 
// Marks this component as a "client component" in Next.js — meaning it runs in the browser (not server-side)

import Link from "next/link";               // For navigation between pages in Next.js
import { Button } from "./ui/button";       // Custom styled button component (from your UI library)
import { SparklesIcon } from "lucide-react"; // Icon component from the Lucide icon set
import { useUserRole } from "@/hooks/useUserRole"; // Custom React hook to get the current user's role

// --- DashboardBtn Component ---
// Displays a "Dashboard" button only for non-candidate users.
function DasboardBtn() {
  // Get user role information from custom hook
  const { isCandidate, isLoading } = useUserRole();

  // If user is a candidate or data is still loading, do not render the button
  if (isCandidate || isLoading) return null;

  // Otherwise, show the Dashboard button linking to /dashboard
  return (
    <Link href={"/dashboard"}>
      <Button className="gap-2 font-medium" size={"sm"}>
        {/* Icon and text side by side */}
        <SparklesIcon className="size-4" />
        Dashboard
      </Button>
    </Link>
  );
}

export default DasboardBtn; // Export for use in other components

