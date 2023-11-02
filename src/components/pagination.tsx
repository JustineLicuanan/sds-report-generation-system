type PageType = {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  paginate: (pageNumber: number) => void;
};

export default function Pagination({ itemsPerPage, totalItems, currentPage, paginate }: PageType) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage)); // Ensure there's at least one page
  const pagesToShow = 5; // The number of pages to show
  const halfPagesToShow = Math.floor(pagesToShow / 2);

  const startPage = Math.min(
    Math.max(1, currentPage - halfPagesToShow),
    Math.max(1, totalPages - pagesToShow + 1)
  );
  const endPage = Math.min(startPage + pagesToShow - 1, totalPages);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <ul className="flex justify-center">
      <li className="inline">
        <button
          type="button"
          onClick={() => paginate(currentPage - 1)}
          className={`bg-gray me-10 mt-1 border border-black/50 px-2 py-2 ${
            currentPage === 1 ? 'text-black/50' : ''
          }`}
          disabled={currentPage === 1}
        >
          &#11207;
        </button>
      </li>

      {pageNumbers.map((number) => (
        <li key={number} className="inline">
          <button
            type="button"
            onClick={() => paginate(number)}
            className={`mx-1 mt-1 border px-3 py-2  ${
              currentPage === number ? 'bg-yellow border-black font-bold' : 'border-black/50'
            }`}
          >
            {number}
          </button>
        </li>
      ))}

      <li className="inline">
        <button
          type="button"
          onClick={() => paginate(currentPage + 1)}
          className={`bg-gray ms-10 mt-1 border border-black/50 px-2 py-2 ${
            currentPage === totalPages ? 'text-black/50' : ''
          }`}
          disabled={currentPage === totalPages}
        >
          &#11208;
        </button>
      </li>
    </ul>
  );
}
