// src/components/SaleProductsTable.jsx
import React from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';

export default function SaleProductsTable({ items, onQtyChange, onRemove }) {
  return (
    <Card className="mb-4">
      <Card.Body style={{ overflowX: 'auto' }}>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Valor Unit.</th>
              <th>Subtotal</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                <td>{it.nome}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={it.quantidade}
                    onChange={e => onQtyChange(i, +e.target.value)}
                    className="form-control"
                  />
                </td>
                <td> 
                  {it.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td>
                  {(it.quantidade * it.valorUnitario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td className="text-center">
                  <Button variant="outline-danger" size="sm" onClick={() => onRemove(i)}>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}
