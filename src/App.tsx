import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Plus, CreditCard } from "lucide-react";
import { Button } from "./components/styled/Common";
import { Modal } from "./components/Modal";
import { SubscriptionForm } from "./components/SubscriptionForm";
import { SubscriptionList } from "./components/SubscriptionList";
import { Auth } from "./components/Auth";
import { supabase } from "./config/supabase";
import { Subscription, SubscriptionFormData } from "./types/subscription";
import { subscriptionApi } from "./api/subscriptions";
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

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  color: #2d3748;
  margin: 0;
  font-weight: bold;
`;

const TitleIcon = styled(CreditCard)`
  color: #4a90e2;
`;

const AddButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
`;

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7fafc;
  font-size: 1.125rem;
  color: #4a5568;
`;

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadSubscriptions();
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
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
      console.error("Failed to load subscriptions:", error);
    }
  };

  const handleSubmit = async (data: SubscriptionFormData) => {
    try {
      if (editingSubscription) {
        const updated = await subscriptionApi.update(
          editingSubscription.id,
          data
        );
        setSubscriptions((subs) =>
          subs.map((sub) => (sub.id === editingSubscription.id ? updated : sub))
        );
        setEditingSubscription(null);
      } else {
        const newSubscription = await subscriptionApi.create(data);
        setSubscriptions((subs) => [...subs, newSubscription]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save subscription:", error);
    }
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("このサブスクリプションを削除してもよろしいですか？")) {
      try {
        await subscriptionApi.delete(id);
        setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
      } catch (error) {
        console.error("Failed to delete subscription:", error);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingSubscription(null);
  };

  if (loading) {
    return <LoadingContainer>読み込み中...</LoadingContainer>;
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <TitleIcon size={32} />
          <Title>サブスクリプション管理</Title>
        </TitleWrapper>
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
