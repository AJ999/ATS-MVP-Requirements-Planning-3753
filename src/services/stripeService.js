```javascript
import supabase from '../lib/supabase';

const SUBSCRIPTION_TABLE = 'subscriptions_bv73k2f9';
const STRIPE_CUSTOMER_TABLE = 'stripe_customers_bv73k2f9';

export const createStripeCustomer = async (userId, email) => {
  try {
    // This would typically make a call to your backend to create a Stripe customer
    const { data, error } = await supabase
      .from(STRIPE_CUSTOMER_TABLE)
      .insert([
        {
          user_id: userId,
          email: email,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw error;
  }
};

export const createSubscription = async (customerId, priceId) => {
  try {
    // This would typically make a call to your backend to create a Stripe subscription
    const { data, error } = await supabase
      .from(SUBSCRIPTION_TABLE)
      .insert([
        {
          customer_id: customerId,
          price_id: priceId,
          status: 'active',
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

export const updateSubscription = async (subscriptionId, updateData) => {
  try {
    const { data, error } = await supabase
      .from(SUBSCRIPTION_TABLE)
      .update(updateData)
      .eq('id', subscriptionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

export const cancelSubscription = async (subscriptionId) => {
  try {
    const { data, error } = await supabase
      .from(SUBSCRIPTION_TABLE)
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString()
      })
      .eq('id', subscriptionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

export const getCustomerSubscription = async (customerId) => {
  try {
    const { data, error } = await supabase
      .from(SUBSCRIPTION_TABLE)
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw error;
  }
};

export const getSubscriptionInvoices = async (subscriptionId) => {
  try {
    // This would typically make a call to your backend to fetch Stripe invoices
    // For now, returning mock data
    return [
      {
        id: 'inv_1',
        date: new Date().toISOString(),
        amount: 299.00,
        status: 'paid',
        invoice_url: '#'
      }
    ];
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};

export const updatePaymentMethod = async (customerId, paymentMethodId) => {
  try {
    // This would typically make a call to your backend to update the payment method
    return {
      success: true,
      message: 'Payment method updated successfully'
    };
  } catch (error) {
    console.error('Error updating payment method:', error);
    throw error;
  }
};
```