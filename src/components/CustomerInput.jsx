// src/components/CustomerInput.jsx
import React from 'react';
import { Form } from 'react-bootstrap';

export default function CustomerInput({ value, onChange }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>Cliente</Form.Label>
      <Form.Control
        type="text"
        placeholder="Nome do cliente"
        value={value}
        onChange={e => onChange(e.target.value)}
        required
      />
    </Form.Group>
  );
}
