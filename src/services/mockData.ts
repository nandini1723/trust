
export type Transaction = {
  id: string;
  amount: number;
  date: Date;
  merchant: string;
  category: string;
  location: string;
  status: 'legitimate' | 'fraud' | 'suspicious';
  cardLast4: string;
  riskScore: number;
  flaggedFeatures?: string[];
};

const merchants = ['Amazon', 'Walmart', 'Target', 'Best Buy', 'Shopify', 'eBay', 'Apple', 'Steam', 'Netflix', 'Uber'];
const categories = ['Shopping', 'Entertainment', 'Travel', 'Food', 'Utilities', 'Technology', 'Services', 'Healthcare'];
const locations = ['USA', 'Canada', 'UK', 'Germany', 'France', 'Italy', 'Japan', 'Australia', 'Brazil', 'Mexico'];
const fraudFeatures = [
  'unusual location', 
  'high amount', 
  'unfamiliar merchant', 
  'multiple transactions', 
  'unusual time', 
  'different device',
  'distance from typical location',
  'new merchant type',
  'behavior anomaly',
  'velocity pattern'
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateCardLast4(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function generateDate(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(
    Math.floor(Math.random() * 24),
    Math.floor(Math.random() * 60),
    Math.floor(Math.random() * 60)
  );
  return date;
}

function generateRiskScore(): number {
  return Math.floor(Math.random() * 100);
}

function generateStatus(riskScore: number): 'legitimate' | 'fraud' | 'suspicious' {
  if (riskScore < 30) return 'legitimate';
  if (riskScore > 70) return 'fraud';
  return 'suspicious';
}

function generateFlaggedFeatures(status: 'legitimate' | 'fraud' | 'suspicious'): string[] | undefined {
  if (status === 'legitimate') return undefined;
  
  const numFeatures = status === 'fraud' ? 
    Math.floor(Math.random() * 3) + 2 : // 2-4 features for fraud
    Math.floor(Math.random() * 2) + 1;  // 1-2 features for suspicious
  
  const features: string[] = [];
  const shuffledFeatures = [...fraudFeatures].sort(() => 0.5 - Math.random());
  
  for (let i = 0; i < numFeatures; i++) {
    features.push(shuffledFeatures[i]);
  }
  
  return features;
}

function generateAmount(status: 'legitimate' | 'fraud' | 'suspicious'): number {
  if (status === 'legitimate') {
    return Math.floor(Math.random() * 200) + 10; // $10-$210
  } else if (status === 'suspicious') {
    return Math.floor(Math.random() * 500) + 200; // $200-$700
  } else {
    return Math.floor(Math.random() * 5000) + 500; // $500-$5500
  }
}

export function generateTransaction(): Transaction {
  const riskScore = generateRiskScore();
  const status = generateStatus(riskScore);
  const flaggedFeatures = generateFlaggedFeatures(status);
  const amount = generateAmount(status);
  
  return {
    id: Math.random().toString(36).substring(2, 15),
    amount,
    date: generateDate(Math.floor(Math.random() * 7)), // Last 7 days
    merchant: getRandomElement(merchants),
    category: getRandomElement(categories),
    location: getRandomElement(locations),
    status,
    cardLast4: generateCardLast4(),
    riskScore,
    flaggedFeatures
  };
}

export function generateTransactions(count: number): Transaction[] {
  const transactions: Transaction[] = [];
  
  for (let i = 0; i < count; i++) {
    transactions.push(generateTransaction());
  }
  
  // Sort by date, newest first
  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function getTransactionStats(transactions: Transaction[]) {
  const total = transactions.length;
  const fraudulent = transactions.filter(t => t.status === 'fraud').length;
  const suspicious = transactions.filter(t => t.status === 'suspicious').length;
  const legitimate = transactions.filter(t => t.status === 'legitimate').length;
  
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const fraudAmount = transactions
    .filter(t => t.status === 'fraud')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate most common fraud features
  const allFeatures = transactions
    .filter(t => t.flaggedFeatures)
    .flatMap(t => t.flaggedFeatures || []);
  
  const featureCounts = allFeatures.reduce((acc: Record<string, number>, feature) => {
    acc[feature] = (acc[feature] || 0) + 1;
    return acc;
  }, {});
  
  const topFeatures = Object.entries(featureCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([feature, count]) => ({ feature, count }));
  
  return {
    total,
    fraudulent,
    suspicious,
    legitimate,
    fraudPercentage: (fraudulent / total) * 100,
    suspiciousPercentage: (suspicious / total) * 100,
    legitimatePercentage: (legitimate / total) * 100,
    totalAmount,
    fraudAmount,
    topFeatures
  };
}
