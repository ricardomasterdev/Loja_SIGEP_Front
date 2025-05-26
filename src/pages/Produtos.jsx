// src/pages/Produtos.jsx
import React, { useState, useEffect } from 'react';
import { Container, Button, Spinner, Row, Col, Modal } from 'react-bootstrap';
import SearchBar from '../components/SearchBar';
import ProductTable from '../components/ProductTable';
import PaginationControl from '../components/PaginationControl';
import NewProductModal from '../components/NewProductModal';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  checkHasVendas
} from '../services/productService';

export default function Produtos() {
  const [allProducts, setAllProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  // Deletion confirmation states
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmProduct, setConfirmProduct] = useState(null);
  const [showCannotDelete, setShowCannotDelete] = useState(false);

  // Load products
  const loadProducts = () => {
    setLoading(true);
    fetchProducts()
      .then(data => {
        setAllProducts(data || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Filter
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const f = allProducts.filter(p => p.nome?.toLowerCase().includes(term));
    setFiltered(f);
    setCurrentPage(1);
  }, [searchTerm, allProducts]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Create or update
  const handleSave = product => {
    const action = product.id ? updateProduct : createProduct;
    action(product)
      .then(() => {
        setShowModal(false);
        setProductToEdit(null);
        loadProducts();
      })
      .catch(err => {
        console.error(err);
        alert('Erro ao salvar produto.');
      });
  };

  // Edit click
  const handleEditClick = product => {
    setProductToEdit(product);
    setShowModal(true);
  };

  // Delete flow
  const handleDeleteClick = product => {
    checkHasVendas(product.id)
      .then(has => {
        setConfirmProduct(product);
        if (has) setShowCannotDelete(true);
        else setShowConfirm(true);
      })
      .catch(err => {
        console.error('Erro ao verificar vendas:', err);
        alert('Não foi possível verificar vínculos de vendas.');
      });
  };

  const confirmDelete = () => {
    deleteProduct(confirmProduct.id)
      .then(() => {
        setShowConfirm(false);
        loadProducts();
      })
      .catch(err => {
        setShowConfirm(false);
        if (err.response?.status === 409) setShowCannotDelete(true);
        else {
          console.error(err);
          alert('Erro ao excluir produto.');
        }
      });
  };

  return (
    <Container fluid>
      <Row className="my-3">
        <Col>
          <Button onClick={() => { setProductToEdit(null); setShowModal(true); }}>
            Cadastrar Novo Produto
          </Button>
        </Col>
      </Row>

      <Row className="my-3">
        <Col xs={12} md={6} lg={4}>
          <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
        </Col>
      </Row>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <ProductTable
            products={paginated}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
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
        </>
      )}

      <NewProductModal
        show={showModal}
        onHide={() => { setShowModal(false); setProductToEdit(null); }}
        onSave={handleSave}
        productToEdit={productToEdit}
      />

      {/* Confirmação de exclusão */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir o produto <strong>{confirmProduct?.nome}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Alerta de vendas associadas */}
      <Modal show={showCannotDelete} onHide={() => setShowCannotDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Não é possível excluir</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          O produto <strong>{confirmProduct?.nome}</strong> não pode ser excluído pois existem vendas associadas.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowCannotDelete(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
