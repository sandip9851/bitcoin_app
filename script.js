const url="https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";
const table = document.querySelector(".data-table");
const marketButton = document.getElementById("btn-market");
const percentageButton = document.getElementById("btn-percent");
const searchBar=document.getElementById('SearchBar');
let mainData;
window.onload = ()=>{
    fetchAndDisplayMainTable();
}

// function for fetching data
async function fetchAndDisplayMainTable(){
    try{
        const response= await fetch(url);
        mainData= await response.json();
        console.log("fetched mainData:",mainData);
        //for displaying mainTable
         displayData(mainData);
    }
    catch(error){
        console.error("Error while fetching main data", error);
    }
}

// function for displaying table.
function displayData(dataArray){ // s used second parameter
    // for negative green display check later - done
    table.innerHTML="";
    dataArray.forEach((data)=>{
    const row=document.createElement('tr');
if(!data.price_change_percentage_24h.toString().includes('-')){
    row.innerHTML=`
    <td><img src="${data.image}" alt="img">${data.name}</td>
    <td>${data.symbol.toUpperCase()}</td>
    <td>$${data.current_price}</td>
    <td>$${data.total_volume}</td>
    <td class="positive">${data.price_change_percentage_24h}%</td>
    <td>Mkt Cap : $${data.market_cap}</td>
    `;
}
else {
    row.innerHTML=`
    <td><img src="${data.image}" alt="img">${data.name}</td>
     <td>${data.symbol.toUpperCase()}</td>
    <td>$${data.current_price}</td>
    <td>$${data.total_volume}</td>
    <td class="negative">${data.price_change_percentage_24h}%</td>
    <td>Mkt Cap : $${data.market_cap}</td>
    `;
}
   
    table.append(row);
    });
    

}

//sort by mktcap
marketButton.addEventListener('click',()=>{
console.log('clicked marketbutton')
console.log(mainData);
let tempData=mainData;
let sortedData=tempData.sort((a,b)=>{
    return a.market_cap-b.market_cap;
})
displayData(sortedData);
})

//sort by percentage
percentageButton.addEventListener('click',()=>{
    console.log('clicked percentageButton')
    console.log(mainData);
    let tempData=mainData;
    let sortedData=tempData.sort((a,b)=>{
        return a.price_change_percentage_24h-b.price_change_percentage_24h;
    })
    displayData(sortedData);
    })
//-------------------------------------------------//
// till here program is running okay


//debouncing function
function debounce(fn, delay=300) {
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
  


//search event calling
let displaySearch = debounce(searchData, 300);
searchBar.addEventListener("keyup", displaySearch);


//search function //triple check
function searchData(event){
    console.log("Fetching data for: ",event.target.value);
    console.log("searcing in",mainData);
    let tempData=mainData;
    try{
        let filteredData=tempData.filter((el)=>{
            //logic for filtering
            return el.name.toLowerCase().includes(event.target.value.toLowerCase()) || el.symbol.toLowerCase().includes(event.target.value.toLowerCase()) ;
        });
        console.log(filteredData);
        displayData(filteredData)
    } catch (error) {
        console.error("Error fetching data for searched value:", error);
      }
}