import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ja } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import { SubscriptionFormData, subscriptionSchema } from '../types/subscription';
import { Button, Input } from './styled/Common';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ErrorMessage = styled.span`
  color: #dc3545;
  font-size: 0.875rem;
`;

const DatePickerWrapper = styled.div`
  position: relative;

  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    border: none;
    border-radius: 0.75rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    padding: 0.75rem;
    background: white;
    font-size: 0.9rem;
  }

  .react-datepicker__header {
    background-color: white;
    border-bottom: 1px solid #E2E8F0;
    border-radius: 0;
    padding: 0.5rem 0;
  }

  .react-datepicker__current-month {
    color: #2D3748;
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .react-datepicker__day-name {
    color: #718096;
    font-weight: 500;
    width: 2rem;
    margin: 0.1rem;
  }

  .react-datepicker__day {
    width: 2rem;
    height: 2rem;
    line-height: 2rem;
    margin: 0.1rem;
    border-radius: 50%;
    transition: all 0.2s ease;
    color: #2D3748;

    &:hover {
      background-color: #EBF8FF;
    }
  }

  .react-datepicker__day--selected {
    background-color: #4A90E2;
    color: white;
    font-weight: 600;

    &:hover {
      background-color: #357ABD;
    }
  }
`;

const StyledInput = styled(Input)`
  padding-left: 2.75rem;
  padding-right: 0.75rem;
  height: 2.75rem;
  background-color: #F8FAFC;
  border-color: #E2E8F0;
  font-size: 1rem;
  text-align: left;
  
  &:hover {
    background-color: white;
  }
  
  &:focus {
    background-color: white;
    border-color: #4A90E2;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.15);
  }
`;

const CalendarIcon = styled(Calendar)`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #4A90E2;
  pointer-events: none;
`;

interface Props {
  onSubmit: (data: SubscriptionFormData) => void;
  initialData?: SubscriptionFormData;
  onCancel?: () => void;
}

export const SubscriptionForm: React.FC<Props> = ({ onSubmit, initialData, onCancel }) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: initialData
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <label htmlFor="name">サブスクリプション名</label>
        <Input
          id="name"
          type="text"
          {...register('name')}
        />
        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <label htmlFor="monthlyPrice">月額料金</label>
        <Input
          id="monthlyPrice"
          type="number"
          {...register('monthlyPrice', { valueAsNumber: true })}
        />
        {errors.monthlyPrice && <ErrorMessage>{errors.monthlyPrice.message}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <label htmlFor="startDate">開始日</label>
        <DatePickerWrapper>
          <Controller
            control={control}
            name="startDate"
            render={({ field }) => (
              <>
                <DatePicker
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date: Date) => field.onChange(date.toISOString().split('T')[0])}
                  dateFormat="yyyy/MM/dd"
                  locale={ja}
                  customInput={<StyledInput />}
                />
                <CalendarIcon size={20} />
              </>
            )}
          />
          {errors.startDate && <ErrorMessage>{errors.startDate.message}</ErrorMessage>}
        </DatePickerWrapper>
      </FormGroup>

      <FormGroup>
        <label htmlFor="memo">メモ（任意）</label>
        <Input
          id="memo"
          type="text"
          {...register('memo')}
        />
      </FormGroup>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        {onCancel && (
          <Button type="button" onClick={onCancel}>
            キャンセル
          </Button>
        )}
        <Button type="submit" variant="primary">
          {initialData ? '更新' : '登録'}
        </Button>
      </div>
    </Form>
  );
};

export default SubscriptionForm;