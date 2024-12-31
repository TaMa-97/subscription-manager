import { z } from 'zod';

export interface Subscription {
  id: string;
  name: string;
  monthlyPrice: number;
  startDate: string;
  memo?: string;
}

export interface SubscriptionFormData {
  name: string;
  monthlyPrice: number;
  startDate: string;
  memo?: string;
}

// Zodを使用したバリデーションスキーマ
export const subscriptionSchema = z.object({
  name: z.string().min(1, { message: '名前を入力してください' }),
  monthlyPrice: z.number().min(0, { message: '0以上の数値を入力してください' }),
  startDate: z.string().min(1, { message: '開始日は必須です' }),
  memo: z.string().optional()
});