import { useState } from "react";

const LoanCalculator = () => {
  const [userValues, setUserValues] = useState({
    amount: "",
    interest: "",
    years: "",
  });

  const handleChange = (e: any) => {
    setUserValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <div>
      LoanCalculator
      <form onSubmit={handleSubmit}>
        <input type="text" name="amount" />
        <input type="text" name="interest" />
        <input type="text" name="years" />
      </form>
    </div>
  );
};

export default LoanCalculator;
