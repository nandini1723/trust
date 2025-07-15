
import { Transaction, generateTransactions, getTransactionStats } from './mockData';

// Initial mock data
let mockTransactions = generateTransactions(50);

export const api = {
  getTransactions: async (): Promise<Transaction[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Random chance to add new transactions (simulating real-time updates)
    if (Math.random() > 0.7) {
      const newTransactions = generateTransactions(Math.floor(Math.random() * 3) + 1);
      mockTransactions = [...newTransactions, ...mockTransactions];
    }
    
    return mockTransactions;
  },
  
  getRecentTransactions: async (count: number = 10): Promise<Transaction[]> => {
    const transactions = await api.getTransactions();
    return transactions.slice(0, count);
  },
  
  getStats: async (): Promise<any> => {
    const transactions = await api.getTransactions();
    return getTransactionStats(transactions);
  },
  
  getTransactionById: async (id: string): Promise<Transaction | null> => {
    const transactions = await api.getTransactions();
    return transactions.find(t => t.id === id) || null;
  },
  
  // Simulate reviewing a transaction (changing its status)
  reviewTransaction: async (id: string, newStatus: 'legitimate' | 'fraud' | 'suspicious'): Promise<Transaction> => {
    const transactions = await api.getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error('Transaction not found');
    }
    
    const updatedTransaction = {
      ...transactions[index],
      status: newStatus
    };
    
    mockTransactions[index] = updatedTransaction;
    return updatedTransaction;
  }
};
