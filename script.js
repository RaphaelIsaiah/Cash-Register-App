// DOM ELEMENT SELECTION
const changeDue = document.getElementById("change-due");
const totalCost = document.getElementById("total-cost");
const purchaseBtn = document.getElementById("purchase-btn");
const changeInDrawer = document.getElementById("change-in-drawer");
const cash = document.getElementById("cash");

// Default values for the price and cash in drawer (cid)
let price = 3.55;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100],
];

totalCost.textContent = price;

// Initially hide the "change-due" section
changeDue.style.display = "none";

/**
 * Function to dynamically update the "change-in-drawer" section
 */
const updateChangeInDrawer = () => {
  changeInDrawer.innerHTML = "";
  cid.forEach(([denom, amount]) => {
    const li = document.createElement("li");
    li.textContent = `${denom}: $${Math.max(0, amount).toFixed(2)}`;
    changeInDrawer.appendChild(li);
  });
};

/**
 * Function to format the change array
 * @param {Array} changeArray - Array of change in denominations
 * @returns {string} - HTML string of formatted change
 */
const formatChange = (changeArray) =>
  changeArray
    .map(([denom, amount]) => `<p>${denom}: $${amount.toFixed(2)}</p>`)
    .join("");

/**
 * Function to calculate change based on cash-in-drawer (cid)
 * @param {number} change - The amount of change required
 * @param {Array} cid - Cash-in-drawer array with denominations and amounts
 * @returns {Object} - Result containing the status and change details
 */
const calculateChange = (change, cid) => {
  const currencyUnits = [
    ["PENNY", 0.01],
    ["NICKEL", 0.05],
    ["DIME", 0.1],
    ["QUARTER", 0.25],
    ["ONE", 1],
    ["FIVE", 5],
    ["TEN", 10],
    ["TWENTY", 20],
    ["ONE HUNDRED", 100],
  ];

  let totalInDrawer = cid.reduce((sum, [_, amount]) => sum + amount, 0);
  totalInDrawer = parseFloat(totalInDrawer.toFixed(2));

  if (change > totalInDrawer) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  if (parseFloat(change.toFixed(2)) === totalInDrawer) {
    // Provide only the change required
    let remainingChange = change;
    let closedChange = [];

    for (let i = currencyUnits.length - 1; i >= 0; i--) {
      const [denom, unitValue] = currencyUnits[i];
      let amountInDrawer = cid[i][1];
      let amount = 0;

      while (remainingChange >= unitValue && amountInDrawer > 0) {
        remainingChange -= unitValue;
        remainingChange = parseFloat(remainingChange.toFixed(2));
        amountInDrawer -= unitValue;
        amount += unitValue;
      }

      if (amount > 0) {
        closedChange.push([denom, amount]);
      }
    }

    // Sort change array explicitly in descending order of unit value
    closedChange.sort(
      (a, b) =>
        currencyUnits.findIndex(([name]) => name === b[0]) -
        currencyUnits.findIndex(([name]) => name === a[0])
    );

    return { status: "CLOSED", change: closedChange };
  }

  let changeArray = [];

  for (let i = currencyUnits.length - 1; i >= 0; i--) {
    const [denom, unitValue] = currencyUnits[i];
    let amountInDrawer = cid[i][1];
    let amount = 0;

    while (change >= unitValue && amountInDrawer > 0) {
      change -= unitValue;
      change = parseFloat(change.toFixed(2));
      amountInDrawer -= unitValue;
      amount += unitValue;
    }

    if (amount > 0) {
      changeArray.push([denom, amount]);
    }

    cid[i][1] = Math.max(0, amountInDrawer); // Ensure no negative values;
  }

  if (change > 0) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  return { status: "OPEN", change: changeArray };
};

/**
 * Function to evaluate the change due for a transaction
 */
const evaluateChange = () => {
  const cashValue = parseFloat(cash.value);

  changeDue.style.display = "none";

  if (isNaN(cashValue) || cashValue <= 0) {
    alert("Please enter a valid amount of cash.");
    return;
  }

  let change = cashValue - price;

  if (change < 0) {
    alert("Customer does not have enough money to purchase the item.");
    return;
  }

  if (change === 0) {
    changeDue.style.display = "block";
    changeDue.innerHTML =
      "<p>No change due - customer paid with exact cash.</p>";
    return;
  }

  const result = calculateChange(change, cid);

  if (result.status === "INSUFFICIENT_FUNDS") {
    changeDue.style.display = "block";
    changeDue.innerHTML = `<p>Status: ${result.status}</p>`;
  } else if (result.status === "CLOSED") {
    changeDue.style.display = "block";
    changeDue.innerHTML = `<p>Status: ${result.status}</p>${formatChange(
      result.change
    )}`;
  } else if (result.status === "OPEN") {
    changeDue.style.display = "block";
    changeDue.innerHTML = `<p>Status: ${result.status}</p>${formatChange(
      result.change
    )}`;
  }

  updateChangeInDrawer();
};

// Event Listeners
purchaseBtn.addEventListener("click", evaluateChange);
cash.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    evaluateChange();
  }
});

// Initial UI update
updateChangeInDrawer();
