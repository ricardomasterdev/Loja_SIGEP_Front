// src/pages/Vendas.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Button, Row, Col, Card,
  Table, Form, Modal
} from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { fetchSales, deleteSale } from '../services/saleService';
import PaginationControl from '../components/PaginationControl';

export default function Vendas() {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmSale, setConfirmSale] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSales().then(data => {
      setSales(data);
      setFilteredSales(data);
    });
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = sales.filter(sale =>
      sale.cliente.toLowerCase().includes(term) ||
      sale.id.toString().includes(term)
    );
    setFilteredSales(filtered);
    setCurrentPage(1);
  }, [searchTerm, sales]);

  const handleDeleteRequest = sale => {
    setConfirmSale(sale);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    deleteSale(confirmSale.id).then(() => {
      setShowConfirm(false);
      setConfirmSale(null);
      fetchSales().then(data => {
        setSales(data);
        setFilteredSales(data);
      });
    });
  };

  const totalPages = Math.ceil(filteredSales.length / pageSize);
  const indexOfLast = currentPage * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const currentSales = filteredSales.slice(indexOfFirst, indexOfLast);

  // Helper para formatar data (apenas dia/mês/ano)
  const formatDate = iso =>
    new Date(iso).toLocaleDateString('pt-BR');

  return (
    <Container fluid>
      <Row className="my-4">
        <Col className="d-flex align-items-center">
          <Button
            variant="primary"
            className="me-3"
            onClick={() => navigate('/vendas/novo')}
          >
            Novo Pedido
          </Button>
        </Col>
      </Row>

      <Card className="p-3 mb-4">
        <Row className="mb-3">
          <Col md={4}>
            <Form.Control
              placeholder="Buscar por Cliente ou ID"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </Col>
        </Row>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Data do Pedido</th> {/* Nova coluna */}
              <th>Cliente</th>
              <th>Valor Total</th>
              <th className="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {currentSales.map(sale => (
              <tr key={sale.id}>
                <td>{sale.id}</td>
                <td>
                  {sale.dataPedido 
                    ? formatDate(sale.dataPedido) 
                    : '—'}
                </td>
                <td>{sale.cliente}</td>
                <td>
                  {sale.valorTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </td>
                <td className="text-center">
                  <FaEdit
                    onClick={() => navigate(`/vendas/${sale.id}/edit`)}
                    style={{ cursor: 'pointer', marginRight: 12 }}
                    size={18}
                    color="#0d6efd"
                    title="Editar"
                  />
                  <FaTrash
                    onClick={() => handleDeleteRequest(sale)}
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

        <Row className="my-3">
          <Col>
            <PaginationControl
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </Col>
        </Row>
      </Card>

      <Modal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir o pedido{' '}
          <strong>#{confirmSale?.id}</strong> —{' '}
          <strong>{confirmSale?.cliente}</strong>?<br/>
          * O estoque dos produtos será RESTAURADO *
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirm(false)}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
