// ===== src/components/ChooseProductModal.jsx =====
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Spinner } from 'react-bootstrap';
import { fetchProducts } from '../services/productService';

export default function ChooseProductModal({ show, onHide, onSelect }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (show) {
      setSearch('');
      setProducts([]);
      setQuantities({});
    }
  }, [show]);

  useEffect(() => {
    if (!search.trim()) {
      setProducts([]);
      return;
    }
    setLoading(true);
    fetchProducts()
      .then(data => {
        const filtered = (data || []).filter(p =>
          p.nome.toLowerCase().includes(search.toLowerCase())
        );
        setProducts(filtered);
      })
      .finally(() => setLoading(false));
  }, [search]);

  const handleQtyChange = (id, value, max) => {
    let num = parseInt(value, 10);
    if (isNaN(num) || num < 1) num = 1;
    if (num > max) {
      window.alert(`Quantidade maior que estoque disponível (${max}).`);
      num = max;
    }
    setQuantities(prev => ({ ...prev, [id]: num }));
  };

  const handleSelect = p => {
    const qty = quantities[p.id] || 1;
    onSelect({ ...p, quantidade: qty });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Selecionar Produto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          placeholder="Buscar produto por nome..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-3"
        />

        {loading && (
          <div className="text-center my-3">
            <Spinner animation="border" />
          </div>
        )}

        {!loading && search.trim() && (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Qtd Disponível</th>
                <th>Quantidade</th>
                <th>Valor Unit.</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.nome}</td>
                  <td>{p.quantidadeDisponivel}</td>
                  <td>
                    <Form.Control
                      type="number"
                      min={1}
                      max={p.quantidadeDisponivel}
                      value={quantities[p.id] || 1}
                      onChange={e =>
                        handleQtyChange(p.id, e.target.value, p.quantidadeDisponivel)
                      }
                      disabled={p.quantidadeDisponivel <= 0}
                    />
                  </td>
                  <td>
                    {p.valorUnitario.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </td>
                  <td className="text-center">
                    {p.quantidadeDisponivel > 0 ? (
                      <Button size="sm" onClick={() => handleSelect(p)}>
                        Selecionar
                      </Button>
                    ) : (
                      <Button size="sm" variant="secondary" disabled>
                        Sem estoque
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {!loading && (!search.trim() || products.length === 0) && (
          <p>
            {!search.trim()
              ? 'Digite um nome para buscar produtos.'
              : 'Nenhum produto encontrado.'}
          </p>
        )}
      </Modal.Body>
    </Modal>
  );
}
