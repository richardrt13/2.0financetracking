export const categoryOptions = {
  income: ['Salário', 'Freelance', 'Investimentos', 'Outros'],
  expense: ['Alimentação', 'Moradia', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Outros'],
  investment: ['Ações', 'Fundos Imobiliários', 'Tesouro Direto', 'Poupança', 'CDB', 'Outros']
};

export const getTransactionTypeLabel = (type) => {
  const labels = {
    income: 'Receita',
    expense: 'Despesa',
    investment: 'Investimento'
  };
  
  return labels[type] || type;
};
