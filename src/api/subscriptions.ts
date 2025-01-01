import { supabase } from '../config/supabase';
import { Subscription, SubscriptionFormData } from '../types/subscription';

export const subscriptionApi = {
  getAll: async (): Promise<Subscription[]> => {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  create: async (data: SubscriptionFormData): Promise<Subscription> => {
    const { data: newSubscription, error } = await supabase
      .from('subscriptions')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return newSubscription;
  },

  update: async (id: string, data: Partial<SubscriptionFormData>): Promise<Subscription> => {
    const { data: updatedSubscription, error } = await supabase
      .from('subscriptions')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updatedSubscription;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};