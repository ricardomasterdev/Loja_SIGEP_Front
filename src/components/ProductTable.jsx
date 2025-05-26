// src/components/ProductTable.jsx
import React from 'react';
import { Card, Table } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function ProductTable({ products = [], onEdit = () => {}, onDelete = () => {} }) {
  return (
    <Card>
      <Card.Body style={{ overflowX: 'auto', maxHeight: '60vh' }}>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Qtd Disponível</th>
              <th>Vl Unitário</th>
              <th style={{ width: '100px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nome}</td>
                <td>{p.descricao}</td>
                <td>{p.quantidadeDisponivel}</td>
                <td>
                  {typeof p.valorUnitario === 'number'
                    ? p.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                    : ''}
                </td>
                <td className="text-center">
                  <FaEdit
                    onClick={() => onEdit(p)}
                    style={{ cursor: 'pointer', marginRight: 12 }}
                    size={18}
                    color="#0d6efd"
                    title="Editar"
                  />
                  <FaTrash
                    onClick={() => onDelete(p)}
                    style={{ cursor: 'pointer' }}
                    size={18}
                    color="#dc3545"
                    title="Excluir"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}
