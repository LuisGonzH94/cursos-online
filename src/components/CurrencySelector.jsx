import { useState, useEffect } from "react";
import UseCurrency from "../hook/UseCurrency";

const CurrencySelector = () => {
  const { currency, changeCurrency } = UseCurrency();
  const [selectedCurrency, setSelectedCurrency] = useState(currency);

  useEffect(() => {
    const storedCurrency = localStorage.getItem("selectedCurrency");
    if (storedCurrency) {
      setSelectedCurrency(storedCurrency); // ✅ Mantiene la moneda seleccionada
    }
  }, []);

  const handleChange = (event) => {
    const newCurrency = event.target.value;
    setSelectedCurrency(newCurrency);
    changeCurrency(newCurrency);
  };

  const handleRefresh = () => {
    console.log("Forzando actualización de la página...");
    window.location.reload(); // ✅ Recarga la página para reflejar cambios
  };

  return (
    <div className="flex flex-col items-center mt-2">
      <label htmlFor="currency" className="text-white text-sm">
        Moneda:
      </label>
      <div className="flex gap-2">
        <select
          id="currency"
          value={selectedCurrency}
          onChange={handleChange}
          className="bg-gray-700 text-white px-2 py-1 rounded-md mt-1"
        >
          {/* 🔥 Se reorganizan dinámicamente las opciones para mostrar primero la moneda actual */}
          {["USD", "EUR", "GBP"]
            .sort((a, b) => (a === selectedCurrency ? -1 : b === selectedCurrency ? 1 : 0))
            .map((currency) => (
              <option key={currency} value={currency}>
                {currency === "USD" ? "$ - Dólar" : currency === "EUR" ? "€ - Euro" : "£ - Libra"}
              </option>
            ))}
        </select>
        <button
          onClick={handleRefresh}
          className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition"
        >
          Actualizar Precios
        </button>
      </div>
    </div>
  );
};

export default CurrencySelector;
