import { supabase } from "../config/supabase";
import { Subscription, SubscriptionFormData } from "../types/subscription";

export const subscriptionApi = {
  getAll: async (): Promise<Subscription[]> => {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching subscriptions:", error);
      throw error;
    }
    return data || [];
  },

  create: async (data: SubscriptionFormData): Promise<Subscription> => {
    console.log("Creating subscription with data:", data);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const subscription = {
      name: data.name,
      monthly_price: data.monthly_price,
      start_date: data.start_date,
      memo: data.memo,
      user_id: user.id,
    };

    const { data: newSubscription, error } = await supabase
      .from("subscriptions")
      .insert([subscription])
      .select()
      .single();

    if (error) {
      console.error("Error creating subscription:", error);
      throw error;
    }

    console.log("Created subscription:", newSubscription);
    return newSubscription;
  },

  update: async (
    id: string,
    data: Partial<SubscriptionFormData>
  ): Promise<Subscription> => {
    console.log("Updating subscription:", id, "with data:", data);

    const { data: updatedSubscription, error } = await supabase
      .from("subscriptions")
      .update({
        name: data.name,
        monthly_price: data.monthly_price,
        start_date: data.start_date,
        memo: data.memo,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating subscription:", error);
      throw error;
    }
    return updatedSubscription;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("subscriptions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting subscription:", error);
      throw error;
    }
  },
};
