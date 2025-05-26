// src/components/AddProductRow.jsx
import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { fetchProducts } from '../services/productService';

export default function AddProductRow({ onAdd }) {
  const [all, setAll] = useState([]);
  const [selected, setSelected] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetchProducts().then(setAll);
  }, []);

  const handleAdd = () => {
    const prod = all.find(p => p.id === +selected);
    if (prod) onAdd({ produtoId: prod.id, nome: prod.nome, valorUnitario: prod.valorUnitario, quantidade: qty });
    setSelected(''); setQty(1);
  };

  return (
    <Row className="align-items-end mb-3">
      <Col md={6}>
        <Form.Group>
          <Form.Label>Produto</Form.Label>
          <Form.Select
            value={selected}
            onChange={e => setSelected(e.target.value)}
          >
            <option value="">-- Selecione --</option>
            {all.map(p => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>
      <Col md={3}>
        <Form.Group>
          <Form.Label>Qtd.</Form.Label>
          <Form.Control
            type="number"
            min="1"
            value={qty}
            onChange={e => setQty(+e.target.value)}
          />
        </Form.Group>
      </Col>
      <Col md={3}>
        <Button
          variant="success"
          className="w-100"
          disabled={!selected}
          onClick={handleAdd}
        >
          Adicionar
        </Button>
      </Col>
    </Row>
  );
}
