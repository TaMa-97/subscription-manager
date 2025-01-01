import React, { useState } from "react";
import styled from "styled-components";
import { Lock, Mail, CreditCard } from "lucide-react";
import { supabase } from "../config/supabase";
import { Button, Input } from "./styled/Common";

const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f6f9fc 0%, #edf2f7 100%);
  padding: 2rem;
`;

const AuthCard = styled.div`
  max-width: 400px;
  width: 100%;
  background: white;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
`;

const Logo = styled(CreditCard)`
  color: #4a90e2;
  width: 48px;
  height: 48px;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #2d3748;
  margin: 0 0 2rem;
  text-align: center;
  font-weight: 700;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const StyledInput = styled(Input)`
  padding-left: 2.75rem;
  height: 3rem;
  background-color: #f8fafc;
  border-color: #e2e8f0;
  font-size: 1rem;

  &:hover {
    background-color: white;
  }

  &:focus {
    background-color: white;
    border-color: #4a90e2;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.15);
  }
`;

const Icon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #4a90e2;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: center;
  background: #fff5f5;
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid #feb2b2;
`;

const LoginButton = styled(Button)`
  height: 3rem;
  font-size: 1rem;
  font-weight: 600;
  width: 100%;
  background: #4a90e2;
  border-radius: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(74, 144, 226, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const Auth: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <LogoContainer>
          <Logo />
        </LogoContainer>
        <Title>サブスクリプション管理</Title>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Icon>
              <Mail size={20} />
            </Icon>
            <StyledInput
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <Icon>
              <Lock size={20} />
            </Icon>
            <StyledInput
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <LoginButton type="submit" variant="primary" disabled={loading}>
            {loading ? "ログイン中..." : "ログイン"}
          </LoginButton>
        </Form>
      </AuthCard>
    </AuthContainer>
  );
};
