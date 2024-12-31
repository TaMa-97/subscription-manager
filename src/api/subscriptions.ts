import axios from 'axios';
import { Subscription, SubscriptionFormData } from '../types/subscription';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const subscriptionApi = {
  getAll: async (): Promise<Subscription[]> => {
    const response = await axios.get(`${API_BASE_URL}/subscriptions`);
    return response.data;
  },

  create: async (data: SubscriptionFormData): Promise<Subscription> => {
    const response = await axios.post(`${API_BASE_URL}/subscriptions`, data);
    return response.data;
  },

  update: async (id: string, data: Partial<SubscriptionFormData>): Promise<Subscription> => {
    const response = await axios.patch(`${API_BASE_URL}/subscriptions/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/subscriptions/${id}`);
  },
};