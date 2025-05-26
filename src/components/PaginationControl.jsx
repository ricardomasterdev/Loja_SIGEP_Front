// ===== src/components/PaginationControl.jsx =====
import React from 'react';
import { Pagination, Form } from 'react-bootstrap';

export default function PaginationControl({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange
}) {
  const sizes = [10, 25, 50, 100];
  const items = [];
  for (let number = 1; number <= totalPages; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => onPageChange(number)}
      >
        {number}
      </Pagination.Item>
    );
  }
  return (
    <div className="d-flex justify-content-between align-items-center">
      <Pagination>{items}</Pagination>
      <Form.Select
        value={pageSize}
        onChange={e => onPageSizeChange(Number(e.target.value))}
        style={{ width: 'auto' }}
      >
        {sizes.map(size => (
          <option key={size} value={size}>
            {size} / página
          </option>
        ))}
      </Form.Select>
    </div>
  );
}
