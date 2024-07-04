const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

let table = document.querySelector(".data-table");
let heroSection = document.getElementById("hero");

window.onload = async () => {
  try {
    let response = await fetch(url);
    const mainData = await response.json();
    displayData(mainData, table);
  } catch (error) {
    console.error("Error fetching data on load:", error);
  }
};

let marketButton = document.getElementById("btn-market");
marketButton.addEventListener("click", async (eve) => {
  eve.preventDefault();
  await sortAndDisplayData('market_cap');
});

let percentageButton = document.getElementById("btn-percent");
percentageButton.addEventListener("click", async (eve) => {
  eve.preventDefault();
  await sortAndDisplayData('price_change_percentage_24h');
});

async function sortAndDisplayData(sortBy) {
  if (table) {
    table.remove();
  }

  if (document.querySelector(".new-data-table")) {
    document.querySelector(".new-data-table").remove();
  }
  if (document.querySelector(".new-data-table2")) {
    document.querySelector(".new-data-table2").remove();
  }

  let newTable = document.createElement("table");
  newTable.setAttribute("border", 1);
  newTable.className = "new-data-table";
  let response = await fetch(url);
  const mainData = await response.json();

  let sortedData = mainData.sort((a, b) => {
    if (sortBy === 'market_cap') {
      return b.market_cap - a.market_cap;
    } else if (sortBy === 'price_change_percentage_24h') {
      return Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h);
    }
  });

  displayData(sortedData, newTable);
  heroSection.append(newTable);
}

function displayData(dataArray, tableElement) {
  dataArray.forEach((data) => {
    let strPercen = String(data.price_change_percentage_24h);
    let filteredPercen = strPercen.replace("-", "");

    let row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${data.image}" alt="img">${data.name}</td>
      <td>${data.symbol}</td>
      <td>$ ${data.current_price}</td>
      <td>$ ${data.total_volume}</td>
      <td class="percen">${filteredPercen}%</td>
      <td>$ ${data.market_cap}</td>
    `;
    tableElement.append(row);
  });
}


function debounce(fn, delay) {
  let timer;
  return function() {
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

async function fetchData(event) {
  console.log("Fetching data for:", event.target.value);
  try {
    const response = await fetch(url);
    const mainData = await response.json();
    let searchedData = mainData.filter((el) => {
      return el.name.toLowerCase().includes(event.target.value.toLowerCase());
    });
    let newTable = document.createElement("table");
    newTable.setAttribute("caption","Seached Table")
    newTable.setAttribute("border", 1); // Add border to make the table visible
    newTable.className = "search-results-table"; // Add a class for styling if needed
    
    displayData(searchedData, newTable);

    // Clear previous search results if any
    const previousTable = document.querySelector(".search-results-table");
    if (previousTable) {
      previousTable.remove();
    }
    const newDataTable = document.querySelector(".new-data-table");
    if (newDataTable) {
      newDataTable.remove();
    }
    const newDataTable2 = document.querySelector(".new-data-table2");
    if (newDataTable2) {
      newDataTable2.remove();
    }
    if (table) {
      table.remove();
    }    // Append the new table to the hero section or any other desired element
    heroSection.append(newTable);




  } catch (error) {
    console.error("Error fetching data:", error);
  }
  
}

let displaySearch = debounce(fetchData, 300);
const searchBar = document.getElementById("SearchBar");
searchBar.addEventListener("keyup", displaySearch);

