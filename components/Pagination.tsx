import { useRouter } from "next/router";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
}

const Pagination = ({ currentPage, totalPages, baseUrl }: PaginationProps) => {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    const url = `${baseUrl}?page=${page}`;
    router.push(url);
  };

  return (
    <div className=" flex items-center justify-center gap-2 mt-6">
      {/* prev button */}
      <Button
        variant={"outline"}
        size={"sm"}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage == 1}
        className=" flex items-center gap-1"
      >
        <ChevronLeft className=" h-4 w-4" />
        Prev
      </Button>

      {/* page */}
      <div className=" flex items-center gap-1"></div>

      {/* next button */}
      <Button
        variant={"outline"}
        size={"sm"}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage == totalPages}
        className=" flex items-center gap-1"
      >
        <ChevronRight className=" h-4 w-4" />
        Next
      </Button>
    </div>
  );
};

export default Pagination;
