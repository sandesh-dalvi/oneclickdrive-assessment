import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/utils/db";
import { formatDate } from "@/utils/format";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { Action } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { GetServerSideProps } from "next";
import Link from "next/link";

interface LogProps {
  logs: {
    id: string;
    action: Action;
    createdAt: string;
    listing: { title: string };
    email: string;
  }[];
}

const getUserEmail = async (id: string) => {
  const user = (await clerkClient()).users.getUser(id);
  const email = (await user).emailAddresses[0]?.emailAddress || "";

  return email;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { userId } = getAuth(context.req);

  if (!userId) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    include: { listing: { select: { title: true } } },
  });

  const formattedLogs = await Promise.all(
    logs.map(async (log) => {
      const email = await getUserEmail(log.clerkUserId);
      return {
        ...log,
        createdAt: log.createdAt.toISOString(),
        email,
      };
    })
  );

  return {
    props: {
      logs: formattedLogs,
    },
  };
};

const AuditLogspage = ({ logs }: LogProps) => {
  return (
    <section className=" container mx-auto p-4">
      <div className=" flex items-center gap-4 mb-6">
        <Button asChild variant={"ghost"} size={"sm"}>
          <Link href={"/"}>
            <ArrowLeft className=" h-4 w-4 mr-2" /> Back
          </Link>
        </Button>

        <h1 className=" text-xl lg:text-2xl">Audit Logs</h1>
      </div>

      {logs.length === 0 ? (
        <h2 className=" text-gray-700">No logs found</h2>
      ) : (
        <div className=" bg-white rounded shadow-md overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Listing</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Admin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className=" border-b">
                  <TableCell className=" p-2">{log.action}</TableCell>
                  <TableCell className=" p-2">{log.listing.title}</TableCell>
                  <TableCell className=" p-2">
                    {formatDate(log.createdAt)}
                  </TableCell>
                  <TableCell className=" p-2">{log.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
};

export default AuditLogspage;
