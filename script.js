document.getElementById('convert-btn').addEventListener('click', function() {
    const amount = parseFloat(document.getElementById('amount').value);
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    const errorMessage = document.getElementById('error-message');
    
    if (isNaN(amount) || amount <= 0) {
      errorMessage.textContent = 'Введите корректную сумму.';
      errorMessage.classList.remove('hidden');
      return;
    }
  
    if (fromCurrency === toCurrency) {
      document.getElementById('converted-amount').value = amount;
      return;
    }
  
    
    const apiUrl = `https://api.exchangerate.host/latest?base=${fromCurrency}&symbols=${toCurrency}`;
  
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data && data.rates && data.rates[toCurrency]) {
          const rate = data.rates[toCurrency];
          const convertedAmount = (amount * rate).toFixed(2);
          document.getElementById('converted-amount').value = convertedAmount;
          errorMessage.classList.add('hidden');
        } else {
          throw new Error('Ошибка получения данных');
        }
      })
      .catch(error => {
        errorMessage.textContent = 'Ошибка. Попробуйте позже.';
        errorMessage.classList.remove('hidden');
      });
  });
  