"use client";
import { Button } from "./ui/button";
import Link from "next/link";

const AuditLogButton = () => {
  return (
    <Button variant={"default"} size={"lg"} asChild>
      <Link href={"/audit-log"}>Check Logs</Link>
    </Button>
  );
};

export default AuditLogButton;
