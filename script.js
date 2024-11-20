const API_KEY = 'a3eea22de79a136a3796e82a';  
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;


const inputAmount = document.getElementById('inputAmount');
const outputAmount = document.getElementById('outputAmount');
const fromCurrencyTabs = document.getElementById('fromCurrencyTabs');
const toCurrencyTabs = document.getElementById('toCurrencyTabs');
const inputCurrencyRate = document.getElementById('inputCurrencyRate');
const outputCurrencyRate = document.getElementById('outputCurrencyRate');

let fromCurrency = 'RUB'; // Исходная валюта
let toCurrency = 'USD'; // Целевая валюта
let lastEditedField = 'input'; // Для отслеживания, в каком поле вводят данные

// Функция для получения курсов валют
async function getExchangeRates() {
    if (!navigator.onLine) {
        // Если нет подключения к интернету, показываем сообщение об ошибке
        errorMessage.textContent = 'Ошибка! Нет подключения к интернету. Невозможно обновить курс валют.';
        errorMessage.style.display = 'block';
        return null;
    }
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        return data.conversion_rates;
    } catch (error) {
        console.error('Ошибка при получении курсов валют:', error);
        return null;
    }
}

// Функция для конвертации валют
async function convertCurrency() {
    const rates = await getExchangeRates();
    if (!rates) return;

    const amount =
        lastEditedField === 'input'
            ? parseFloat(inputAmount.value) // Если редактируется левое поле
            : parseFloat(outputAmount.value); // Если редактируется правое поле

    if (isNaN(amount)) {
        // Если поле пустое, очищаем оба поля
        if (lastEditedField === 'input') {
            outputAmount.value = '';
        } else {
            inputAmount.value = '';
        }
        return;
    }

    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];

    // Если исходная и целевая валюта одинаковы, скрываем или очищаем отображение курса
    if (fromCurrency === toCurrency) {
        inputCurrencyRate.textContent = '';
        outputCurrencyRate.textContent = '';
        return;
    }

    if (lastEditedField === 'input') {
        // Конвертация слева направо
        const convertedAmount = (amount / fromRate) * toRate;
        outputAmount.value = convertedAmount.toFixed(4);
    } else {
        // Конвертация справа налево
        const convertedAmount = (amount * fromRate) / toRate;
        inputAmount.value = convertedAmount.toFixed(4);
    }

    // Обновление курсов валют на странице
    inputCurrencyRate.textContent = `1 ${fromCurrency} = ${(toRate / fromRate).toFixed(4)} ${toCurrency}`;
    outputCurrencyRate.textContent = `1 ${toCurrency} = ${(fromRate / toRate).toFixed(4)} ${fromCurrency}`;
}

// Обработчик нажатий на вкладки выбора валют
function handleCurrencyTabClick(event, isFromCurrency) {
    const selectedTab = event.target;
    const allTabs = selectedTab.parentNode.children;

    // Удаляем класс active у всех вкладок
    for (let tab of allTabs) {
        tab.classList.remove('active');
    }

    selectedTab.classList.add('active'); // Добавляем класс active для выбранной вкладки

    if (isFromCurrency) {
        fromCurrency = selectedTab.innerText; // Обновляем исходную валюту
    } else {
        toCurrency = selectedTab.innerText; // Обновляем целевую валюту
    }

    convertCurrency(); // Выполняем пересчёт
}

// События для вкладок выбора валют
fromCurrencyTabs.addEventListener('click', (event) => handleCurrencyTabClick(event, true));
toCurrencyTabs.addEventListener('click', (event) => handleCurrencyTabClick(event, false));

// Слушаем изменения в левом поле (inputAmount)
inputAmount.addEventListener('input', () => {
    lastEditedField = 'input'; // Обновляем флаг
    convertCurrency(); // Выполняем пересчёт
});

// Слушаем изменения в правом поле (outputAmount)
outputAmount.addEventListener('input', () => {
    lastEditedField = 'output'; // Обновляем флаг
    convertCurrency(); // Выполняем пересчёт
});

// Убираем атрибут readonly с правого поля
outputAmount.removeAttribute('readonly');

// Слушаем изменение через step (стрелочки)
inputAmount.addEventListener('change', () => {
    lastEditedField = 'input';
    convertCurrency(); // Пересчитываем валюты после изменения значения через стрелочки
});

outputAmount.addEventListener('change', async () => {
    lastEditedField = 'output';

    // После изменения значения с помощью стрелочек
    let newAmount = parseFloat(outputAmount.value);
    if (isNaN(newAmount)) return;

    const rates = await getExchangeRates();
    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];

    // Вычисляем новое значение с учетом конвертации
    const convertedAmount = (newAmount * fromRate) / toRate;
    inputAmount.value = convertedAmount.toFixed(4);

    convertCurrency(); // Пересчитываем валюты после изменения значения через стрелочки
});

// Выполняем первичную конвертацию при загрузке страницы
convertCurrency();