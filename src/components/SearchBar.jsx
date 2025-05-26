// ===== src/components/SearchBar.jsx =====
import React from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';

export default function SearchBar({ searchTerm, onSearch }) {
  return (
    <InputGroup className="mb-3">
      <FormControl
        placeholder="Buscar produto por nome..."
        value={searchTerm}
        onChange={e => onSearch(e.target.value)}
      />
    </InputGroup>
  );
}