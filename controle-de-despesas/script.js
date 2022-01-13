const transactionsUl = document.querySelector("#transactions");
const incomeDisplay = document.querySelector("#money-plus");
const expenseDisplay = document.querySelector("#money-minus");
const balanceDisplay = document.querySelector("#balance");
const form = document.querySelector("#form");
const inputTransactionName = document.querySelector("#text");
const inputTransactionAmount = document.querySelector("#amount");

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

const transactions =
  localStorageTransactions !== null ? localStorageTransactions : [];

const removeTransaction = (li) => {
  transactionsUl.removeChild(li);
  const parsedId = Number(li.id.replace(/\D/g, ""));
  const removedTransaction = transactions.findIndex(
    (value) => value.id === parsedId
  );

  transactions.splice(removedTransaction, 1);

  updateLocalStorage();

  updateBalanceValues();

  showAlert("error", "Transação removida com sucesso!", parsedId);
};

const createLiHTML = (name, operator, amountWithoutOperator, li) => {
  return `
  ${name} <span>${operator} R$${amountWithoutOperator}</span>
  <button class="delete-btn" onClick="removeTransaction(${li})">
    x
  </button>
`;
};

const addTransactionIntoDOM = ({ id, name, amount }) => {
  const operator = amount < 0 ? "-" : "+";
  const CSSClass = amount < 0 ? "minus" : "plus";
  const amountWithoutOperator = Math.abs(amount);

  const li = document.createElement("li");

  li.classList.add(CSSClass);
  li.id = `transaction${id}`;

  li.innerHTML = createLiHTML(name, operator, amountWithoutOperator, li.id);

  transactionsUl.prepend(li);
};

const getExpenses = (transactionsAmounts) =>
  Math.abs(
    transactionsAmounts
      .filter((value) => value < 0)
      .reduce((accumulator, value) => accumulator + value, 0)
  ).toFixed(2);

const getIncomes = (transactionsAmounts) =>
  transactionsAmounts
    .filter((value) => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2);

const getTotal = (transactionsAmounts) =>
  transactionsAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2);

const updateBalanceValues = () => {
  const transactionsAmounts = transactions.map(({ amount }) => amount);

  const total = getTotal(transactionsAmounts);

  const income = getIncomes(transactionsAmounts);

  const expense = getExpenses(transactionsAmounts);

  balanceDisplay.textContent = `R$ ${total}`;
  incomeDisplay.textContent = `R$ ${income}`;
  expenseDisplay.textContent = `R$ ${expense}`;
};

const init = () => {
  transactions.forEach(addTransactionIntoDOM);

  updateBalanceValues();
};

init();

const updateLocalStorage = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

const generateID = () => Math.round(Math.random() * 1000);

const addToTransactionsArray = (transactionName, transactionAmount) => {
  const id = generateID();
  const newTransaction = {
    id,
    name: transactionName,
    amount: Number(transactionAmount),
  };
  transactions.push(newTransaction);

  showAlert("success", "Transação criada com sucesso!", id);

  return newTransaction;
};

const cleanInputs = () => {
  inputTransactionName.value = "";
  inputTransactionAmount.value = "";
};

const handleFormSubmit = (event) => {
  event.preventDefault();

  const transactionName = inputTransactionName.value.trim();
  const transactionAmount = inputTransactionAmount.value.trim();
  const isSomeInputEmpty = transactionName === "" || transactionAmount === "";

  if (isSomeInputEmpty) {
    alert("Por favor, preencha o nome e o valor da transação!");
    return;
  }

  const transaction = addToTransactionsArray(
    transactionName,
    transactionAmount
  );

  updateLocalStorage();

  addTransactionIntoDOM(transaction);

  showAlert("success", "Transação criada com sucesso!");

  updateBalanceValues();

  cleanInputs();
};

form.addEventListener("submit", handleFormSubmit);

const hideAlert = (id) => {
  const alertElement = document.querySelector(`.alert-${id}`);
  if (alertElement) alertElement.parentElement.removeChild(alertElement);
};

const showAlert = (type, message, id, time = 7) => {
  hideAlert();
  const markup = `<div class="alert alert-${id} alert--${type}">${message}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);

  window.setTimeout(() => hideAlert(id), time * 1000);
};
