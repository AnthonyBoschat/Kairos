type PaginationToken = number | "ellipsis";

export function buildPaginationTokens(params: {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
  boundaryCount?: number;
  maxVisible?: number;
}): PaginationToken[] {
  const {
    currentPage,
    totalPages,
    siblingCount = 1,
    boundaryCount = 1,
    maxVisible = 7,
  } = params;

  if (totalPages <= 0) return [];

  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const range = (start: number, end: number) =>
    Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);

  if (totalPages <= maxVisible) {
    return range(1, totalPages);
  }

  const startPages = range(1, boundaryCount);
  const endPages = range(totalPages - boundaryCount + 1, totalPages).filter((p) => p > 0);

  const siblingsStart = Math.max(
    Math.min(
      safeCurrentPage - siblingCount,
      totalPages - boundaryCount - siblingCount * 2 - 1
    ),
    boundaryCount + 2
  );

  const siblingsEnd = Math.min(
    Math.max(
      safeCurrentPage + siblingCount,
      boundaryCount + siblingCount * 2 + 2
    ),
    totalPages - boundaryCount - 1
  );

  const tokens: PaginationToken[] = [];

  tokens.push(...startPages);

  if (siblingsStart > boundaryCount + 2) tokens.push("ellipsis");
  else if (boundaryCount + 1 < siblingsStart) tokens.push(boundaryCount + 1);

  tokens.push(...range(siblingsStart, siblingsEnd));

  if (siblingsEnd < totalPages - boundaryCount - 1) tokens.push("ellipsis");
  else if (siblingsEnd + 1 < totalPages - boundaryCount + 1) tokens.push(totalPages - boundaryCount);

  tokens.push(...endPages);

  // enlever doublons consécutifs
  return tokens.filter((token, index, array) => token !== array[index - 1]);
}
