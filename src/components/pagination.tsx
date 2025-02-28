"use client";

import { useMemo } from "react";

import {
  Pagination as PaginationBase,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationButton,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { LIST_ENTITY_PAGE_SIZE } from "~/lib/constants";

interface Props {
  currentPage: number;
  totalElements: number;
  pageSize?: number;
  className?: string;
  onChange: (page: number) => void;
}

const PAGES_TO_SHOW = 4;

export default function Pagination({
  currentPage,
  totalElements,
  className,
  onChange,
  pageSize = LIST_ENTITY_PAGE_SIZE,
}: Props) {
  const totalPages = Math.ceil(totalElements / pageSize);
  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < totalPages;
  const pages = useMemo(() => {
    if (totalPages <= PAGES_TO_SHOW + 2) {
      // Show all pages if they fit within the limit
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pagesToShow = [];

    // When on or near the first page
    if (currentPage <= 3) {
      pagesToShow.push(1, 2, 3, 4);
      pagesToShow.push("...");
      pagesToShow.push(totalPages);
    }
    // When on or near the last page
    else if (currentPage >= totalPages - 2) {
      pagesToShow.push(1);
      pagesToShow.push("...");
      pagesToShow.push(
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
    }
    // When somewhere in the middle
    else {
      pagesToShow.push(1);
      pagesToShow.push("...");
      pagesToShow.push(currentPage - 1, currentPage, currentPage + 1);
      pagesToShow.push("...");
      pagesToShow.push(totalPages);
    }

    return pagesToShow;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <PaginationBase className={className}>
      <PaginationContent>
        <PaginationItem disabled={!canGoBack}>
          <PaginationPrevious
            className="h-12 md:h-10"
            onClick={() => onChange(currentPage - 1)}
          />
        </PaginationItem>
        {PAGES_TO_SHOW > totalPages && currentPage > 3 && (
          <>
            <PaginationItem>
              <PaginationButton
                className="size-12 md:size-10"
                onClick={() => onChange(1)}
              >
                1
              </PaginationButton>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}
        {pages.map((page, index) => (
          <PaginationItem key={index}>
            {typeof page === "string" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationButton
                className="size-12 md:size-10"
                onClick={() => onChange(page)}
                isActive={page === currentPage}
              >
                {page}
              </PaginationButton>
            )}
          </PaginationItem>
        ))}
        {PAGES_TO_SHOW > totalPages && currentPage < totalPages - 2 && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationButton
                className="size-12 md:size-10"
                onClick={() => onChange(totalPages)}
              >
                {totalPages}
              </PaginationButton>
            </PaginationItem>
          </>
        )}
        <PaginationItem disabled={!canGoForward}>
          <PaginationNext
            className="h-12 md:h-10"
            onClick={() => onChange(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationBase>
  );
}
