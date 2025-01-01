import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Plus } from "lucide-react";
import { Button } from "./components/styled/Common";
import { Modal } from "./components/Modal";
import { SubscriptionForm } from "./components/SubscriptionForm";
import { SubscriptionList } from "./components/SubscriptionList";
import { Auth } from "./components/Auth";
import { supabase } from "./config/supabase";
import { Subscription, SubscriptionFormData } from "./types/subscription";
import type { User } from "@supabase/supabase-js";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background: #f7fafc;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  color: #2d3748;
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
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 現在のセッションを確認
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = (data: SubscriptionFormData) => {
    if (editingSubscription) {
      // 編集モード
      const updatedSubscriptions = subscriptions.map((sub) =>
        sub.id === editingSubscription.id ? { ...sub, ...data } : sub
      );
      setSubscriptions(updatedSubscriptions);
      setEditingSubscription(null);
    } else {
      // 新規登録モード
      const newSubscription: Subscription = {
        id: Date.now().toString(),
        ...data,
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
    if (window.confirm("このサブスクリプションを削除してもよろしいですか？")) {
      setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingSubscription(null);
  };

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
        title={
          editingSubscription
            ? "サブスクリプション編集"
            : "サブスクリプション登録"
        }
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
