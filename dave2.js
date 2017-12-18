//NOTE: This script depends upon stores.js being loaded before it

'use strict';

//calculates the hourly totals for all stores' array $arr and optionally adds a total for all hourly totals by setting addSum
//returns the result as an array
var arrTotals = function(arr,addSum) {
  var arrTotals = [];
  var totDaily = 0;
  for (var i = 0; i < arrStoreHrs.length; ++i) {
    var totPerHour = 0;
    for (var j = 0; j < arrStores.length; ++j) totPerHour += arrStores[j][arr][i];
    arrTotals[i] = totPerHour;
    totDaily += totPerHour;
  }
  if (addSum) arrTotals.push(totDaily);

  return arrTotals;
};

//renders into a customer per hour table $tableId
var renderCustTable = function(tableId) {
  renderArrAsHead(arrStoreHrs,tableId,' ','Totals');
  for (var i = 0; i < arrStores.length; ++i)
    renderArrAsRow(arrStores[i].custPerHour,tableId,arrStores[i].locale,arrStores[i].totalCust);
  renderArrAsRow(arrTotals('custPerHour',1),tableId,'Totals','');
};

//renders into a cookie sales table $tableId
var renderSalesTable = function(tableId) {
  renderArrAsHead(arrStoreHrs,tableId,' ','Totals');
  for (var i = 0; i < arrStores.length; ++i)
    renderArrAsRow(arrStores[i].cookiesPerHour,tableId,arrStores[i].locale,arrStores[i].totalCookies);
  renderArrAsRow(arrTotals('cookiesPerHour',1), tableId,'Totals','');
};

//render into a tossers required per store per hour table $tableId
var renderTosserTable = function(tableId) {
  renderArrAsHead(arrStoreHrs,tableId,' ','');
  for (var i = 0; i < arrStores.length; ++i)
    renderArrAsRow(arrStores[i].tossPerHour,tableId,arrStores[i].locale,'');
  renderArrAsRow(arrTotals('tossPerHour',0),tableId,'Totals','');
};

renderCustTable('customer_table');
renderSalesTable('sales_table');
renderTosserTable('tosser_table');

//Data and objects
//*******************************************************************************************************************
//specific store data array
//array data is of the form [store location, address, opening hour in military time, closing hour in military time, minimum
//number of customers, maximum number of customers, average cookies per customer]
var arrStoreData = [  ['1st and Pike', 6, 20, 23, 65, 6.3],
                      ['SeaTac Airport', 6, 20, 3, 24, 1.2],
                      ['Seattle Center', 6, 20, 11, 38, 3.7],
                      ['Capitol Hill', 6, 20, 20, 38, 2.3],
                      ['Alki', 6, 20, 2, 16, 4.6] ];

//The earliest and latest store hours among all locations
var earlyHour = arrStoreData[0][1];
var lateHour = arrStoreData[0][2];
for (var i = 1; i < arrStoreData.length; ++i) {
  if (arrStoreData[i][1] < earlyHour) earlyHour = arrStoreData[i][1];
  if (arrStoreData[i][2] > lateHour) lateHour = arrStoreData[i][2];
}

//array of store hours for printing table headers
var arrStoreHrs = [];
for (var i = 0; i < lateHour - earlyHour; ++i) arrStoreHrs[i] = hourToStd(earlyHour + i);

//Global helper functions
//*******************************************************************************************************************
//Converts from military time to standard time
function hourToStd(hour) {
  if (hour < 12) hour += 'am';
  else if (hour === 12) hour += 'pm';
  else {
    hour -= 12;
    hour += 'pm';
  }
  return hour;
};

//Generates a random integer between min and max, inclusive
var random = function(min,max) {
  return Math.round(Math.random() * (max - min) + min);
};

//Appends a header to table $tableId using elements in array $arr. Adds a header $addHead and final column $addLast if desired
var renderArrAsHead = function(arr,tableId,addHead,addLast) {
  var trEl = document.createElement('tr');

  //Create header column for row using addHead if applicable
  if (addHead) {
    var thEl = document.createElement('th');
    thEl.textContent = addHead;
    trEl.appendChild(thEl);
  }

  //Generate <th>'s for header
  for (var i = 0; i < arr.length; ++i) {
    var thEl = document.createElement('th');
    thEl.textContent = arr[i];
    trEl.appendChild(thEl);
  }

  //Create ending column using addLast if applicable
  if (addLast) {
    var thEl = document.createElement('th');
    thEl.textContent = addLast;
    trEl.appendChild(thEl);
  }

  document.getElementById(tableId).appendChild(trEl);
};

//Appends a row to table $tableId using elements in array $arr. Adds a header $addHead and final column $addLast if desired
var renderArrAsRow = function(arr,tableId,addHead,addLast) {
  var trEl = document.createElement('tr');

  //Create header column for row using addHead if applicable
  if (addHead) {
    var thEl = document.createElement('th');
    thEl.textContent = addHead;
    trEl.appendChild(thEl);
  }

  //Generate <td>'s for row
  for (var i = 0; i < arr.length; ++i) {
    var tdEl = document.createElement('td');
    tdEl.textContent = arr[i];
    trEl.appendChild(tdEl);
  }

  //Create ending column using addLast if applicable
  if (addLast) {
    var tdEl = document.createElement('td');
    tdEl.textContent = addLast;
    trEl.appendChild(tdEl);
  }

  document.getElementById(tableId).appendChild(trEl);
};

//Store constructor function
//*******************************************************************************************************************
var Store = function(locale,hrOpen,hrClose,minCust,maxCust,cookiePerHr) {
  this.locale = locale;
  this.hourOpen = hrOpen;
  this.hourClose = hrClose;
  this.minCustomers = minCust;
  this.maxCustomers = maxCust;
  this.cookiesPerCust = cookiePerHr;
  this.minToss = 2;
  this.custPerToss = 20;
  this.custPerHour = [];
  this.cookiesPerHour = [];
  this.tossPerHour = [];
  this.totalCust = 0;
  this.totalCookies = 0;
}

//Store prototype methods
//*******************************************************************************************************************
//Simulates the number of customers for this store object for every hour of all stores' operations
//Uses that number of customers to build associated arrays for cookies sold per hour and tossers required per hour
Store.prototype.simCust = function() {
  //size and initialize arrays
  for (var i = 0; i < lateHour - earlyHour; ++i) {
    this.custPerHour.push(0);
    this.cookiesPerHour.push(0);
    this.tossPerHour.push(0);
  }
  //load applicable array elements
  for (var i = this.hourOpen - earlyHour; i < this.hourClose - earlyHour; ++i) {
    console.log(i);
    this.custPerHour[i] = random(this.minCustomers,this.maxCustomers);
    this.cookiesPerHour[i] = Math.ceil(this.custPerHour[i] * this.cookiesPerCust);
    this.tossPerHour[i] = Math.ceil(this.custPerHour[i] / this.custPerToss);
    if (this.tossPerHour[i] < this.minToss) this.tossPerHour[i] = this.minToss;
    this.totalCust += this.custPerHour[i];
    this.totalCookies += this.cookiesPerHour[i];
  }
};

//Instantiate store objects and load them into array
//*******************************************************************************************************************
var arrStores = [];
for (var i = 0; i < arrStoreData.length; i++) {
  arrStores.push(new Store(arrStoreData[i][0], arrStoreData[i][1], arrStoreData[i][2], arrStoreData[i][3], arrStoreData[i][4], arrStoreData[i][5]));
  arrStores[i].simCust();
}
