import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Plus } from 'lucide-react';
import { Button } from './components/styled/Common';
import { Modal } from './components/Modal';
import { SubscriptionForm } from './components/SubscriptionForm';
import { SubscriptionList } from './components/SubscriptionList';
import { Auth } from './components/Auth';
import { supabase } from './config/supabase';
import { Subscription, SubscriptionFormData } from './types/subscription';
import { subscriptionApi } from './api/subscriptions';
import type { User } from '@supabase/supabase-js';

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 現在のセッションを確認
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadSubscriptions();
      }
      setLoading(false);
    });

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadSubscriptions();
      } else {
        setSubscriptions([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const data = await subscriptionApi.getAll();
      setSubscriptions(data);
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
    }
  };

  const handleSubmit = async (data: SubscriptionFormData) => {
    try {
      if (editingSubscription) {
        // 編集モード
        const updated = await subscriptionApi.update(editingSubscription.id, data);
        setSubscriptions(subs => 
          subs.map(sub => sub.id === editingSubscription.id ? updated : sub)
        );
        setEditingSubscription(null);
      } else {
        // 新規登録モード
        const newSubscription = await subscriptionApi.create(data);
        setSubscriptions(subs => [...subs, newSubscription]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save subscription:', error);
      // TODO: エラー処理の実装
    }
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('このサブスクリプションを削除してもよろしいですか？')) {
      try {
        await subscriptionApi.delete(id);
        setSubscriptions(subscriptions.filter(sub => sub.id !== id));
      } catch (error) {
        console.error('Failed to delete subscription:', error);
        // TODO: エラー処理の実装
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingSubscription(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Auth />;
  }

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