const inputAmount = document.getElementById("input-amount");
const outputAmount = document.getElementById("output-amount");
const tabsLeft = document.querySelectorAll(".currency-box:first-child .tab");
const tabsRight = document.querySelectorAll(".currency-box:last-child .tab");
const rateLeft = document.getElementById("exchange-rate-left");
const rateRight = document.getElementById("exchange-rate-right");
const errorMessage = document.getElementById("error-message");

let fromCurrency = "RUB";
let toCurrency = "USD";

async function fetchExchangeRate(base, symbols) {
    try {
        const response = await fetch(`https://api.exchangerate.host/latest?base=${base}&symbols=${symbols}`);
        if (!response.ok) {
            throw new Error("API sorğusunda xəta.");
        }
        const data = await response.json();
        return data.rates[symbols];
    } catch (error) {
        errorMessage.textContent = "Məlumat yüklənərkən xəta baş verdi.";
        console.error(error);
        return null;
    }
}

async function updateConversion() {
    errorMessage.textContent = "";
    if (fromCurrency === toCurrency) {
        outputAmount.value = inputAmount.value;
        rateLeft.textContent = `1 ${fromCurrency} = 1 ${toCurrency}`;
        rateRight.textContent = `1 ${toCurrency} = 1 ${fromCurrency}`;
        return;
    }

    const rate = await fetchExchangeRate(fromCurrency, toCurrency);
    const reverseRate = await fetchExchangeRate(toCurrency, fromCurrency);
    if (rate && reverseRate) {
        const converted = (inputAmount.value * rate).toFixed(4);
        outputAmount.value = converted;
        rateLeft.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
        rateRight.textContent = `1 ${toCurrency} = ${reverseRate.toFixed(4)} ${fromCurrency}`;
    }
}

function setActiveTab(tabs, currency) {
    tabs.forEach(tab => {
        if (tab.dataset.currency === currency) {
            tab.classList.add("active");
        } else {
            tab.classList.remove("active");
        }
    });
}

tabsLeft.forEach(tab => {
    tab.addEventListener("click", () => {
        fromCurrency = tab.dataset.currency;
        setActiveTab(tabsLeft, fromCurrency);
        updateConversion();
    });
});

tabsRight.forEach(tab => {
    tab.addEventListener("click", () => {
        toCurrency = tab.dataset.currency;
        setActiveTab(tabsRight, toCurrency);
        updateConversion();
    });
});

inputAmount.addEventListener("input", updateConversion);

// İlk yüklənmədə məlumatı yenilə
updateConversion();
  