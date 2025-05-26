// src/pages/VendaIncluir.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Button,
  Row,
  Col,
  Card,
  Modal,
  Form // <— importado para o picker
} from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate, useMatch } from 'react-router-dom';
import CustomerInput from '../components/CustomerInput';
import SaleProductsTable from '../components/SaleProductsTable';
import ChooseProductModal from '../components/ChooseProductModal';
import {
  createSale,
  fetchSaleById,
  updateSale
} from '../services/saleService';
import { fetchProducts } from '../services/productService';

export default function VendaIncluir() {
  const navigate = useNavigate();
  const match = useMatch('/vendas/:id/edit');
  const isEdit = Boolean(match);
  const id = match?.params.id;

  const [cliente, setCliente] = useState('');
  const [items, setItems] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [showChooseModal, setShowChooseModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // --- Novo estado para dataPedido, default = agora em formato compatível com <input type="datetime-local">
  const [dataPedido, setDataPedido] = useState(() => {
    const now = new Date();
    // slice para "YYYY-MM-DDTHH:mm"
    return now.toISOString().slice(0,16);
  });

  useEffect(() => {
    fetchProducts().then(pl => setProductsList(pl || []));
  }, []);

  useEffect(() => {
    if (isEdit && productsList.length > 0) {
      fetchSaleById(id)
        .then(data => {
          setCliente(data.cliente);
          // popula dataPedido com o valor vindo do back (converte ISO→"YYYY-MM-DDTHH:mm")
          if (data.dataPedido) {
            setDataPedido(new Date(data.dataPedido).toISOString().slice(0,16));
          }
          setItems(
            data.produtos.map(p => {
              const prod = productsList.find(x => x.id === p.produtoId) || {};
              return {
                produtoId: p.produtoId,
                nome: prod.nome || '',
                valorUnitario: prod.valorUnitario || 0,
                quantidade: p.quantidade
              };
            })
          );
        })
        .catch(err => {
          console.error('Erro ao carregar venda:', err);
          alert('Não foi possível carregar a venda para edição.');
          navigate('/vendas');
        });
    }
  }, [isEdit, id, productsList, navigate]);

  const valorTotal = items.reduce(
    (sum, it) => sum + it.quantidade * it.valorUnitario,
    0
  );

  const handleSelectProduct = p => {
    setItems(prev => [
      ...prev,
      {
        produtoId: p.id,
        nome: p.nome,
        valorUnitario: p.valorUnitario,
        quantidade: p.quantidade
      }
    ]);
    setShowChooseModal(false);
  };

  const handleQtyChange = (index, newQty) => {
    setItems(prev =>
      prev.map((it, i) => (i === index ? { ...it, quantidade: newQty } : it))
    );
  };

  const handleRemove = index => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!cliente.trim()) {
      setAlertMessage('O nome do cliente é obrigatório.');
      setShowAlert(true);
      return;
    }
    if (items.length === 0) {
      setAlertMessage('Adicione ao menos um produto.');
      setShowAlert(true);
      return;
    }

    // converte de "YYYY-MM-DDTHH:mm" → ISO completo
    const isoDate = new Date(dataPedido).toISOString();

    const payload = {
      cliente,
      valorTotal,
      dataPedido: isoDate,       // <-- inclui dataPedido
      produtos: items.map(it => ({
        produtoId: it.produtoId,
        quantidade: it.quantidade,
        valorUnitario: it.valorUnitario
      }))
    };

    console.log('🛰️ Enviando payload de venda:', payload); // log de debug

    if (isEdit) {
      updateSale({ id, ...payload })
        .then(() => setShowSuccess(true))
        .catch(err => {
          console.error('Erro ao atualizar venda:', err);
          setAlertMessage('Excedido Estoque disponível.');
          setShowAlert(true);
        });
    } else {
      createSale(payload)
        .then(() => setShowSuccess(true))
        .catch(err => {
          console.error('Erro ao criar venda:', err);
          setAlertMessage('Erro ao registrar a venda.');
          setShowAlert(true);
        });
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/vendas');
  };

  return (
    <Container fluid>
      <h3 className="my-4">{isEdit ? 'Editar Venda' : 'Nova Venda'}</h3>
      <Card className="p-3 mb-4">
        <CustomerInput value={cliente} onChange={setCliente} />

        {/* Picker de data/hora do pedido */}
        <Form.Group className="mb-3" controlId="dataPedido">
          <Form.Label>Data do Pedido</Form.Label>
          <Form.Control
            type="datetime-local"
            value={dataPedido}
            onChange={e => setDataPedido(e.target.value)}
          />
        </Form.Group>

        <Button
          variant="secondary"
          className="mb-3"
          onClick={() => setShowChooseModal(true)}
        >
          Adicionar Produto
        </Button>

        <SaleProductsTable
          items={items}
          onQtyChange={handleQtyChange}
          onRemove={handleRemove}
        />

        <Row className="align-items-center mt-3">
          <Col>
            <h5>
              Total:{' '}
              {valorTotal.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </h5>
          </Col>
          <Col className="text-end">
            <Button variant="primary" onClick={handleSubmit}>
              {isEdit ? 'Atualizar Venda' : 'Finalizar Venda'}
            </Button>
          </Col>
        </Row>

        <ChooseProductModal
          show={showChooseModal}
          onHide={() => setShowChooseModal(false)}
          onSelect={handleSelectProduct}
          selectedProducts={items.map(it => ({
            id: it.produtoId,
            quantidade: it.quantidade
          }))}
        />

        {/* Modal de Validação */}
        <Modal show={showAlert} onHide={() => setShowAlert(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Atenção</Modal.Title>
          </Modal.Header>
          <Modal.Body>{alertMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setShowAlert(false)}>
              Ok
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal de Sucesso */}
        <Modal show={showSuccess} onHide={handleSuccessClose} centered>
          <Modal.Header closeButton style={{ backgroundColor: '#d4edda' }}>
            <Modal.Title className="text-success">
              {isEdit ? 'Venda Atualizada' : 'Venda Concluída'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <FaCheckCircle size={64} className="text-success mb-2" />
            <p className="mt-3">
              {isEdit
                ? 'Venda atualizada com sucesso!'
                : 'Venda registrada com sucesso!'}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={handleSuccessClose}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
    </Container>
  );
}
