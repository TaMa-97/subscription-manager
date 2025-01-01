import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { LogOut, User, ChevronDown } from "lucide-react";
import { supabase } from "../config/supabase";

const UserMenuContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const UserButton = styled.button<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  background: white;
  color: #4a5568;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.2s;
  font-size: 0.875rem;

  &:hover {
    background: #f7fafc;
    border-color: #cbd5e0;
  }

  svg {
    color: #718096;
    transition: transform 0.2s ease;
  }

  svg:last-child {
    transform: ${(props) => (props.isOpen ? "rotate(180deg)" : "rotate(0)")};
  }
`;

const MenuDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  min-width: 14rem;
  z-index: 50;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
  transform: ${(props) =>
    props.isOpen ? "translateY(0)" : "translateY(-10px)"};
  transition: all 0.2s;
  overflow: hidden;
`;

const UserInfo = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
`;

const UserAvatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background: #ebf4ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;

  svg {
    color: #4a90e2;
  }
`;

const UserEmail = styled.div`
  color: #2d3748;
  font-size: 0.875rem;
  font-weight: 500;
  word-break: break-all;
`;

const MenuItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  background: none;
  color: #e53e3e;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;

  &:hover {
    background: #fff5f5;
  }

  &:first-child {
    border-top-left-radius: 0.75rem;
    border-top-right-radius: 0.75rem;
  }

  &:last-child {
    border-bottom-left-radius: 0.75rem;
    border-bottom-right-radius: 0.75rem;
  }

  svg {
    color: currentColor;
  }
`;

interface Props {
  email: string;
}

export const UserMenu: React.FC<Props> = ({ email }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (window.confirm("ログアウトしてもよろしいですか？")) {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }
  };

  return (
    <UserMenuContainer ref={menuRef}>
      <UserButton onClick={() => setIsOpen(!isOpen)} isOpen={isOpen}>
        <User size={18} />
        <ChevronDown size={16} />
      </UserButton>

      <MenuDropdown isOpen={isOpen}>
        <UserInfo>
          <UserAvatar>
            <User size={20} />
          </UserAvatar>
          <UserEmail>{email}</UserEmail>
        </UserInfo>
        <MenuItem onClick={handleLogout}>
          <LogOut size={18} />
          ログアウト
        </MenuItem>
      </MenuDropdown>
    </UserMenuContainer>
  );
};
