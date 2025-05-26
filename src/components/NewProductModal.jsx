// src/components/NewProductModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function NewProductModal({ show, onHide, onSave, productToEdit }) {
  const initialForm = { id: null, nome: '', descricao: '', quantidadeDisponivel: '', valorUnitario: null };
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({ quantidadeDisponivel: '', valorUnitario: '' });

  // Ao abrir o modal, pré-carrega dados se for edição
  useEffect(() => {
    if (show) {
      if (productToEdit) {
        setForm({
          id: productToEdit.id,
          nome: productToEdit.nome || '',
          descricao: productToEdit.descricao || '',
          quantidadeDisponivel: productToEdit.quantidadeDisponivel?.toString() || '',
          valorUnitario: productToEdit.valorUnitario ?? null
        });
      } else {
        setForm(initialForm);
      }
      setErrors({ quantidadeDisponivel: '', valorUnitario: '' });
    }
  }, [show, productToEdit]);

  // Formata número para moeda BRL
  const formatCurrency = value => {
    if (value === null || isNaN(value)) return '';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Converte raw input para número (centavos)
  const parseCurrency = str => {
    const digits = str.replace(/\D/g, '');
    return digits ? parseInt(digits, 10) / 100 : null;
  };

  const validateNumber = (name, num) => {
    let error = '';
    if (typeof num !== 'number' || num <= 0) {
      error = 'Deve ser maior que zero.';
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'quantidadeDisponivel') {
      const num = parseFloat(value);
      validateNumber(name, num);
      setForm(prev => ({ ...prev, [name]: value }));
    } else if (name === 'valorUnitario') {
      const num = parseCurrency(value);
      validateNumber(name, num);
      setForm(prev => ({ ...prev, valorUnitario: num }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const numQtd = parseFloat(form.quantidadeDisponivel);
    const validQtd = validateNumber('quantidadeDisponivel', numQtd);
    const validVal = validateNumber('valorUnitario', form.valorUnitario);
    if (validQtd && validVal) {
      onSave({
        id: form.id,
        nome: form.nome,
        descricao: form.descricao,
        quantidadeDisponivel: numQtd,
        valorUnitario: form.valorUnitario
      });
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{productToEdit ? 'Editar Produto' : 'Novo Produto'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="nome">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="descricao">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="quantidadeDisponivel">
            <Form.Label>Quantidade Disponível</Form.Label>
            <Form.Control
              type="number"
              name="quantidadeDisponivel"
              value={form.quantidadeDisponivel}
              onChange={handleChange}
              required
              isInvalid={!!errors.quantidadeDisponivel}
            />
            <Form.Control.Feedback type="invalid">
              {errors.quantidadeDisponivel}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="valorUnitario">
            <Form.Label>Valor Unitário</Form.Label>
            <Form.Control
              type="text"
              name="valorUnitario"
              value={formatCurrency(form.valorUnitario)}
              onChange={handleChange}
              required
              isInvalid={!!errors.valorUnitario}
            />
            <Form.Control.Feedback type="invalid">
              {errors.valorUnitario}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancelar</Button>
          <Button variant="primary" type="submit">
            {productToEdit ? 'Salvar Alterações' : 'Cadastrar'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
