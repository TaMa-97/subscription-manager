import styled from 'styled-components';

export const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: #4A90E2;
          color: white;
          &:hover { background: #357ABD; }
        `;
      case 'danger':
        return `
          background: #E25C5C;
          color: white;
          &:hover { background: #D14343; }
        `;
      default:
        return `
          background: #E9ECEF;
          color: #495057;
          &:hover { background: #DEE2E6; }
        `;
    }
  }}
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
  background: white;
  color: #2D3748;

  &:focus {
    outline: none;
    border-color: #4A90E2;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  }

  &:hover {
    border-color: #CBD5E0;
  }

  &[type="date"] {
    position: relative;
    padding-right: 2.5rem;
    cursor: pointer;
    color-scheme: light;

    &::-webkit-calendar-picker-indicator {
      position: absolute;
      right: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
      width: 1.5rem;
      height: 1.5rem;
      cursor: pointer;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%234A90E2' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
      opacity: 1;
    }

    &::-webkit-datetime-edit {
      padding: 0;
    }

    &::-webkit-datetime-edit-fields-wrapper {
      padding: 0;
    }

    &::-webkit-datetime-edit-text {
      padding: 0 0.2em;
      color: #4A90E2;
    }

    &::-webkit-datetime-edit-month-field,
    &::-webkit-datetime-edit-day-field,
    &::-webkit-datetime-edit-year-field {
      padding: 0 0.2em;
    }

    &::-webkit-inner-spin-button {
      display: none;
    }
  }
`;