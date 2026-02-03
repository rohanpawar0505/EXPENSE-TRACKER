let currentUser = "";
let chart = null;

function loadUser() {
  currentUser = personName.value.trim();
  if (!currentUser) return alert("Enter person name");
  renderExpenses(getData());
}

function getData() {
  return JSON.parse(localStorage.getItem(currentUser)) || [];
}

function saveData(data) {
  localStorage.setItem(currentUser, JSON.stringify(data));
}

function addExpense() {
  if (!currentUser) return alert("Load person first");

  const name = expenseName.value.trim();
  const amt = Number(amount.value);
  const cat = category.value;

  if (!name || !amt) return alert("Fill all fields");

  const data = getData();
  data.push({
    name,
    amount: amt,
    category: cat,
    date: new Date().toISOString()
  });

  saveData(data);
  renderExpenses(data);

  expenseName.value = "";
  amount.value = "";
}

function renderExpenses(data) {
  list.innerHTML = "";
  let sum = 0;
  let catTotal = {};

  data.forEach((e, i) => {
    sum += e.amount;
    catTotal[e.category] = (catTotal[e.category] || 0) + e.amount;

    list.innerHTML += `
      <div class="expense">
        <b>${e.name}</b> - ₹${e.amount}<br>
        ${e.category}<br>
        ${new Date(e.date).toLocaleString()}<br><br>
        <button onclick="deleteExpense(${i})">Delete</button>
      </div>
    `;
  });

  total.innerText = `Total: ₹ ${sum}`;
  drawChart(catTotal);
}

function deleteExpense(i) {
  const data = getData();
  data.splice(i, 1);
  saveData(data);
  renderExpenses(data);
}

function drawChart(catTotal) {
  const ctx = document.getElementById("chart").getContext("2d");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(catTotal),
      datasets: [{
        data: Object.values(catTotal)
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

/* FILTERS */
function showAll() {
  renderExpenses(getData());
}

function showToday() {
  const t = new Date().toDateString();
  renderExpenses(getData().filter(e =>
    new Date(e.date).toDateString() === t
  ));
}

function showMonth() {
  const m = new Date().getMonth();
  renderExpenses(getData().filter(e =>
    new Date(e.date).getMonth() === m
  ));
}

/* SHOW STORED DATA WITH EXPENSES */
function showStoredData() {
  const box = document.getElementById("storedData");
  box.innerHTML = "<h3>Stored Users</h3>";

  for (let key in localStorage) {
    const data = JSON.parse(localStorage.getItem(key));
    if (!Array.isArray(data)) continue;

    box.innerHTML += `<div class="user-box"><b>${key}</b></div>`;

    data.forEach(e => {
      box.innerHTML += `
        <div class="expense">
          ${e.name} - ₹${e.amount}<br>
          ${e.category}<br>
          ${new Date(e.date).toLocaleString()}
        </div>
      `;
    });
  }
}

function clearAllData() {
  if (confirm("Delete all data?")) {
    localStorage.clear();
    list.innerHTML = "";
    storedData.innerHTML = "";
    total.innerText = "Total: ₹ 0";
    if (chart) chart.destroy();
  }
}
