import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Plus, CreditCard } from "lucide-react";
import { Button } from "./components/styled/Common";
import { Modal } from "./components/Modal";
import { SubscriptionForm } from "./components/SubscriptionForm";
import { SubscriptionList } from "./components/SubscriptionList";
import { Auth } from "./components/Auth";
import { UserMenu } from "./components/UserMenu";
import { supabase } from "./config/supabase";
import { Subscription, SubscriptionFormData } from "./types/subscription";
import { subscriptionApi } from "./api/subscriptions";
import type { User } from "@supabase/supabase-js";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  min-height: 100vh;
  background: #f7fafc;

  @media (min-width: 640px) {
    padding: 2rem;
  }
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #2d3748;
  margin: 0;
  font-weight: bold;

  @media (min-width: 640px) {
    font-size: 1.875rem;
  }
`;

const TitleIcon = styled(CreditCard)`
  color: #4a90e2;
  min-width: 24px;
  width: 24px;
  height: 24px;

  @media (min-width: 640px) {
    min-width: 32px;
    width: 32px;
    height: 32px;
  }
`;

const AddButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  width: 100%;

  @media (min-width: 640px) {
    width: auto;
  }
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
    // 現在のセッションを確認
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadSubscriptions();
    }
  }, [user]);

  const loadSubscriptions = async () => {
    try {
      const data = await subscriptionApi.getAll();
      setSubscriptions(data);
    } catch (error) {
      console.error("Error loading subscriptions:", error);
    }
  };

  const handleSubmit = async (data: SubscriptionFormData) => {
    try {
      if (editingSubscription) {
        // 編集モード
        const updatedSubscription = await subscriptionApi.update(
          editingSubscription.id,
          data
        );
        setSubscriptions(
          subscriptions.map((sub) =>
            sub.id === editingSubscription.id ? updatedSubscription : sub
          )
        );
        setEditingSubscription(null);
      } else {
        // 新規登録モード
        const newSubscription = await subscriptionApi.create(data);
        setSubscriptions([newSubscription, ...subscriptions]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving subscription:", error);
    }
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("この固定費を削除してもよろしいですか？")) {
      try {
        await subscriptionApi.delete(id);
        setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
      } catch (error) {
        console.error("Error deleting subscription:", error);
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
        <HeaderLeft>
          <TitleIcon />
          <Title>固定費管理</Title>
        </HeaderLeft>
        <HeaderRight>
          <AddButton variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            新規登録
          </AddButton>
          <UserMenu email={user.email || ""} />
        </HeaderRight>
      </Header>

      <SubscriptionList
        subscriptions={subscriptions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingSubscription ? "固定費編集" : "固定費登録"}
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
