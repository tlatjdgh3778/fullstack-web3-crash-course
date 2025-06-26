export function calculateTotal(amounts: string): number {
    const amountList = amounts
      .split('\n')
      .map(amount => amount.trim())
      .filter(amount => amount.length > 0)
      .map(amount => parseFloat(amount) || 0);
  
    return amountList.reduce((sum, amount) => sum + amount, 0);
  }