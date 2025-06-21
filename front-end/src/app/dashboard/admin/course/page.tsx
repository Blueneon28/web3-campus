"use client";
import React, { useEffect } from "react";
import CourseDashboard from "@/features/admin/course";
import { useRouter } from "next/navigation";

const CourseDashboardPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/dashboard/admin/course/issue-certificate");
  }, []);
  return <CourseDashboard />;
};

export default CourseDashboardPage;
