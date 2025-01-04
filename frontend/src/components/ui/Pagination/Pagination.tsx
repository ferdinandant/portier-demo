import React from "react";
import { Button, IconButton, HStack } from "@chakra-ui/react";
import {
  BsChevronLeft,
  BsChevronRight,
  BsChevronDoubleLeft,
  BsChevronDoubleRight,
} from "react-icons/bs";

type Props = {
  currentPage: number;
  maxPage: number;
  onChangePage?: (page: number) => any;
};

export default function Pagination(props: Props) {
  const { currentPage, maxPage, onChangePage } = props;
  const maxPagesToShow = 5;

  // Calculate page range
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(maxPage, startPage + maxPagesToShow - 1);
  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  const handlePageChange = (page: number) => {
    if (onChangePage) {
      onChangePage(page);
    }
  };

  if (maxPage === 0) {
    return null;
  }
  return (
    <HStack mt={4} style={{ justifyContent: "center" }}>
      {/* Prev buttons */}
      <IconButton
        disabled={currentPage === 1}
        variant="outline"
        onClick={() => handlePageChange(1)}
      >
        <BsChevronDoubleLeft />
      </IconButton>
      <IconButton
        disabled={currentPage === 1}
        variant="outline"
        onClick={() => handlePageChange(currentPage - 1)}
      >
        <BsChevronLeft />
      </IconButton>
      {/* Page numbers */}
      {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
        const pageNumber = startPage + i;
        const isCurrentPage = currentPage === pageNumber;
        return (
          <Button
            key={pageNumber}
            variant={isCurrentPage ? "solid" : "outline"}
            colorPalette={isCurrentPage ? "blue" : "gray"}
            onClick={() => handlePageChange(startPage + i)}
          >
            {pageNumber}
          </Button>
        );
      })}
      {/* Next buttons */}
      <IconButton
        disabled={currentPage === maxPage}
        variant="outline"
        onClick={() => handlePageChange(currentPage + 1)}
      >
        <BsChevronRight />
      </IconButton>
      <IconButton
        disabled={currentPage === maxPage}
        variant="outline"
        onClick={() => handlePageChange(maxPage)}
      >
        <BsChevronDoubleRight />
      </IconButton>
    </HStack>
  );
}
