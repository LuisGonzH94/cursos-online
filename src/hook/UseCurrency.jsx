import { useState, useEffect } from "react";

const UseCurrency = () => {
  const [currency, setCurrency] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedCurrency") || "USD"; // ✅ Carga la moneda guardada
    }
    return "USD"; // ✅ Previene error en SSR
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedCurrency", currency); // ✅ Guarda cada cambio en localStorage
    }
  }, [currency]);

  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem("selectedCurrency", newCurrency);
    window.dispatchEvent(new Event("currencyChange")); // 🔥 Notifica a la app
  };

  return { currency, changeCurrency };
};

export default UseCurrency;
