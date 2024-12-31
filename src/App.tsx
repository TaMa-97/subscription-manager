import React, { useState } from 'react';
import styled from 'styled-components';
import { Plus } from 'lucide-react';
import { Button } from './components/styled/Common';
import { Modal } from './components/Modal';
import { SubscriptionForm } from './components/SubscriptionForm';
import { SubscriptionList } from './components/SubscriptionList';
import { Subscription, SubscriptionFormData } from './types/subscription';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background: #F7FAFC;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  color: #2D3748;
  margin: 0;
  font-weight: bold;
`;

const AddButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
`;

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

  const handleSubmit = (data: SubscriptionFormData) => {
    if (editingSubscription) {
      // 編集モード
      const updatedSubscriptions = subscriptions.map(sub =>
        sub.id === editingSubscription.id
          ? { ...sub, ...data }
          : sub
      );
      setSubscriptions(updatedSubscriptions);
      setEditingSubscription(null);
    } else {
      // 新規登録モード
      const newSubscription: Subscription = {
        id: Date.now().toString(),
        ...data
      };
      setSubscriptions([...subscriptions, newSubscription]);
    }
    setIsModalOpen(false);
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('このサブスクリプションを削除してもよろしいですか？')) {
      setSubscriptions(subscriptions.filter(sub => sub.id !== id));
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingSubscription(null);
  };

  return (
    <Container>
      <Header>
        <Title>サブスクリプション管理</Title>
        <AddButton variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          新規登録
        </AddButton>
      </Header>

      <SubscriptionList
        subscriptions={subscriptions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingSubscription ? 'サブスクリプション編集' : 'サブスクリプション登録'}
      >
        <SubscriptionForm
          onSubmit={handleSubmit}
          initialData={editingSubscription || undefined}
          onCancel={handleModalClose}
        />
      </Modal>
    </Container>
  );
}

export default App;