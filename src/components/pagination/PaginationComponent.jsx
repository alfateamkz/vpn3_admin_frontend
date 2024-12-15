import React from "react";
import "./PaginationComponent.scss";

export const PaginationControls = ({
  currentPage,
  setCurrentPage,
  limit,
  setLimit,
  totalCount,
}) => {
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1); // Сбрасываем страницу на 1 при изменении лимита
  };

  return (
    <div className="pagination-controls">
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Предыдущая
        </button>
        <span>Страница {currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={totalCount <= currentPage * limit}
        >
          Следующая
        </button>
      </div>
      <div className="limit-selector">
        <label>Показывать по:</label>
        <select value={limit} onChange={handleLimitChange}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </div>
  );
};
