import { z } from 'zod';

export const subscriptionSchema = z.object({
  name: z.string().min(1, { message: '名前を入力してください' }),
  monthly_price: z.number().min(0, { message: '0以上の数値を入力してください' }),
  start_date: z.string().min(1, { message: '開始日は必須です' }),
  memo: z.string().optional()
});

export type SubscriptionFormData = {
  name: string;
  monthly_price: number;
  start_date: string;
  memo?: string;
};

export interface Subscription extends Omit<SubscriptionFormData, 'monthly_price'> {
  id: string;
  user_id: string;
  monthly_price: number;
  created_at: string;
  updated_at: string;
}