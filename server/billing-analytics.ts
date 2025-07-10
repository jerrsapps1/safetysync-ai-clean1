import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export interface BillingAnalytics {
  totalRevenue: number;
  monthlyRevenue: number;
  subscriptionRevenue: number;
  certificateRevenue: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  churnRate: number;
  averageRevenuePerUser: number;
  customerLifetimeValue: number;
  failedPayments: number;
  pendingInvoices: number;
}

export interface SubscriptionTier {
  essential: number;
  professional: number;
  enterprise: number;
  enterprisePlus: number;
}

export class BillingAnalyticsService {
  
  async getBillingAnalytics(): Promise<BillingAnalytics> {
    try {
      // Get all customers
      const customers = await stripe.customers.list({ limit: 100 });
      
      // Get all subscriptions
      const subscriptions = await stripe.subscriptions.list({ 
        limit: 100,
        expand: ['data.customer', 'data.items.data.price']
      });

      // Get invoices for the current month
      const currentMonth = new Date();
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const invoices = await stripe.invoices.list({
        created: {
          gte: Math.floor(startOfMonth.getTime() / 1000)
        },
        limit: 100
      });

      // Get payment intents for certificate fees
      const paymentIntents = await stripe.paymentIntents.list({
        created: {
          gte: Math.floor(startOfMonth.getTime() / 1000)
        },
        limit: 100
      });

      // Calculate subscription revenue
      let subscriptionRevenue = 0;
      let activeSubscriptions = 0;
      let expiredSubscriptions = 0;

      subscriptions.data.forEach(sub => {
        if (sub.status === 'active') {
          activeSubscriptions++;
          // Calculate monthly revenue (convert from cents)
          const monthlyAmount = sub.items.data.reduce((total, item) => {
            return total + (item.price?.unit_amount || 0);
          }, 0) / 100;
          subscriptionRevenue += monthlyAmount;
        } else if (sub.status === 'canceled' || sub.status === 'past_due') {
          expiredSubscriptions++;
        }
      });

      // Calculate certificate/one-time revenue
      let certificateRevenue = 0;
      paymentIntents.data.forEach(payment => {
        if (payment.status === 'succeeded' && payment.metadata?.type === 'certificate') {
          certificateRevenue += payment.amount / 100; // Convert from cents
        }
      });

      // Calculate monthly revenue from invoices
      let monthlyRevenue = 0;
      let failedPayments = 0;
      let pendingInvoices = 0;

      invoices.data.forEach(invoice => {
        if (invoice.status === 'paid') {
          monthlyRevenue += invoice.amount_paid / 100; // Convert from cents
        } else if (invoice.status === 'payment_failed') {
          failedPayments++;
        } else if (invoice.status === 'open') {
          pendingInvoices++;
        }
      });

      // Calculate total revenue (all-time)
      const allInvoices = await stripe.invoices.list({
        status: 'paid',
        limit: 100
      });
      
      const totalRevenue = allInvoices.data.reduce((total, invoice) => {
        return total + (invoice.amount_paid / 100);
      }, 0);

      // Calculate churn rate
      const totalSubscriptions = activeSubscriptions + expiredSubscriptions;
      const churnRate = totalSubscriptions > 0 ? (expiredSubscriptions / totalSubscriptions) * 100 : 0;

      // Calculate ARPU (Average Revenue Per User)
      const averageRevenuePerUser = customers.data.length > 0 ? totalRevenue / customers.data.length : 0;

      // Estimate Customer Lifetime Value (simplified calculation)
      const customerLifetimeValue = churnRate > 0 ? (averageRevenuePerUser / (churnRate / 100)) : averageRevenuePerUser * 12;

      return {
        totalRevenue,
        monthlyRevenue,
        subscriptionRevenue,
        certificateRevenue,
        activeSubscriptions,
        expiredSubscriptions,
        churnRate,
        averageRevenuePerUser,
        customerLifetimeValue,
        failedPayments,
        pendingInvoices
      };

    } catch (error) {
      console.error('Error fetching billing analytics:', error);
      // Return zero values if Stripe data unavailable
      return {
        totalRevenue: 0,
        monthlyRevenue: 0,
        subscriptionRevenue: 0,
        certificateRevenue: 0,
        activeSubscriptions: 0,
        expiredSubscriptions: 0,
        churnRate: 0,
        averageRevenuePerUser: 0,
        customerLifetimeValue: 0,
        failedPayments: 0,
        pendingInvoices: 0
      };
    }
  }

  async getSubscriptionsByTier(): Promise<SubscriptionTier> {
    try {
      const subscriptions = await stripe.subscriptions.list({ 
        status: 'active',
        limit: 100,
        expand: ['data.items.data.price']
      });

      const tierCounts = {
        essential: 0,
        professional: 0,
        enterprise: 0,
        enterprisePlus: 0
      };

      subscriptions.data.forEach(sub => {
        sub.items.data.forEach(item => {
          const price = item.price;
          if (price?.unit_amount) {
            const monthlyAmount = price.unit_amount / 100;
            
            // Map prices to tiers (adjust these based on your actual pricing)
            if (monthlyAmount >= 49 && monthlyAmount < 95) {
              tierCounts.essential++;
            } else if (monthlyAmount >= 95 && monthlyAmount < 225) {
              tierCounts.professional++;
            } else if (monthlyAmount >= 225 && monthlyAmount < 555) {
              tierCounts.enterprise++;
            } else if (monthlyAmount >= 555) {
              tierCounts.enterprisePlus++;
            }
          }
        });
      });

      return tierCounts;
    } catch (error) {
      console.error('Error fetching subscription tiers:', error);
      return {
        essential: 0,
        professional: 0,
        enterprise: 0,
        enterprisePlus: 0
      };
    }
  }

  async getRecentTransactions(limit: number = 10) {
    try {
      const charges = await stripe.charges.list({
        limit,
        expand: ['data.customer']
      });

      return charges.data.map(charge => ({
        id: charge.id,
        amount: charge.amount / 100,
        currency: charge.currency.toUpperCase(),
        status: charge.status,
        customerEmail: charge.customer && typeof charge.customer === 'object' ? charge.customer.email : null,
        description: charge.description,
        created: new Date(charge.created * 1000),
        type: charge.metadata?.type || 'subscription'
      }));
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
      return [];
    }
  }
}

export const billingAnalytics = new BillingAnalyticsService();