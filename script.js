let currentUser = "";
let chart;

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

  const name = expenseName.value;
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
}

function renderExpenses(data) {
  list.innerHTML = "";
  let total = 0;
  let catTotal = {};

  data.forEach((e, i) => {
    total += e.amount;
    catTotal[e.category] = (catTotal[e.category] || 0) + e.amount;

    list.innerHTML += `
      <div class="expense">
        <b>${e.name}</b> - ₹${e.amount}<br>
        ${e.category}<br>
        ${new Date(e.date).toLocaleString()}
        <button onclick="deleteExpense(${i})">Delete</button>
      </div>
    `;
  });

  total.innerText = `Total: ₹ ${total}`;
  drawChart(catTotal);
}

function deleteExpense(i) {
  const data = getData();
  data.splice(i, 1);
  saveData(data);
  renderExpenses(data);
}

function drawChart(catTotal) {
  if (chart) chart.destroy();
  chart = new Chart(chart, {
    type: "pie",
    data: {
      labels: Object.keys(catTotal),
      datasets: [{ data: Object.values(catTotal) }]
    }
  });
}

/* FILTERS */
function showAll() { renderExpenses(getData()); }
function showToday() {
  const t = new Date().toDateString();
  renderExpenses(getData().filter(e => new Date(e.date).toDateString() === t));
}
function showMonth() {
  const m = new Date().getMonth();
  renderExpenses(getData().filter(e => new Date(e.date).getMonth() === m));
}

/* ✅ SHOW STORED DATA PROPERLY */
function showStoredData() {
  const box = document.getElementById("storedData");
  box.innerHTML = "<h3>📊 Stored Data</h3>";

  if (localStorage.length === 0) {
    box.innerHTML += "<p>No data found</p>";
    return;
  }

  for (let key in localStorage) {
    const data = JSON.parse(localStorage.getItem(key));
    box.innerHTML += `<div class="user-box"><h4>👤 ${key}</h4></div>`;
    data.forEach(e => {
      box.innerHTML += `
        <div class="expense">
          ${e.name} | ₹${e.amount} | ${e.category}<br>
          ${new Date(e.date).toLocaleString()}
        </div>
      `;
    });
  }
}

/* 🗑 CLEAR ALL DATA */
function clearAllData() {
  if (confirm("Delete all stored data?")) {
    localStorage.clear();
    storedData.innerHTML = "";
    list.innerHTML = "";
    total.innerText = "Total: ₹ 0";
    if (chart) chart.destroy();
  }
}
