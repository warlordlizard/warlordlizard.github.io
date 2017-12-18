'use strict';

var hours = ['6am', '7am', '8am','9am','10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm'];

function random(min,max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//day 2 constructor
var allStoresData = [ ['1st and Pike', 23, 65, 6.3],
                       ['Seatac International Airport', 3, 24, 1.2],
                       ['Seattle Center', 11, 38, 3.7],
                       ['Capitol Hill', 20, 38, 2.3],
                       ['Alki Beach', 2, 16, 4.6] ];
var allStores = [];
var form = document.getElementById('store_form');
var storeTable = document.getElementById('store-sales');
// var hourlytotal = [];
// var data = [];



function Store(name, minCust, maxCust, avgCookie) {
  this.name= name;
  this.minCust= minCust;
  this.maxCust= maxCust;
  this.avgCookie= avgCookie;
  this.custEachHr= [];
  this.cookiesEachHr= [];
  this.totalDailySales= 0;
  this.totalCust = 0;
  this.totalCookies = 0;
  // this.calcCookiesEachHr();
  // allStores.push(this);
  // hourlytotal.push(this.totalDailySales);
  this.fakeCust = function() {
    for (var i =0; i<hours.length; i++) {
      this.custEachHr[i] = random(this.minCust, this.maxCust);
      this.cookiesEachHr[i] = Math.ceil(this.custEachHr[i] * this.avgCookie);
      this.totalCust += this.custEachHr[i];
      this.totalCookies += this.cookiesEachHr[i];
    }
  }
  this.fakeCust();
}

for (var i = 0; i < allStoresData.length; i++) {
  allStores.push(new Store(allStoresData[i][0], allStoresData[i][1], allStoresData[i][2], allStoresData[i][3]));
}

// var totals = function() {
//   var colTotals = [];
//   var dailyTotal = 0;
//   for (var i = 0; i < hours.length; i++) {
//     var totalPerHr = 0;
//     for (var j = 0; j < allStores.length; j++) {
//       totalPerHr += allStores
//     }
//   }
//
// }
//
// Store.prototype.calcCustEachHr= function(){
//   for(var i = 0; i < hours.length; i++) {
//     this.custEachHr.push(random(this.minCust, this.maxCust));
//   }
// };
// Store.prototype.calcCookiesEachHr= function(){
//   this.calcCustEachHr();
//   for(var i = 0; i < hours.length; i++) {
//     var oneHour = Math.ceil(this.custEachHr[i] * this.avgCookie);
//     this.cookiesEachHr.push(oneHour);
//     this.totalDailySales += oneHour;
//   };
//
// };

// Store.prototype.calcHourlyTotal = function () {
//   for(var i = 0; i < hours.length; i++) {
//     var oneHour = Math.ceil(this.custEachHr[i] * this.avgCookie);
//     this.cookiesEachHr.push(oneHour);
//     this.totalDailySales += oneHour;
//   };
// };

Store.prototype.render = function() {
   var trEl = document.createElement('tr');
   var tdEl = document.createElement('td');
   var thEl = document.createElement('th');
   thEl.textContent = this.name;
   trEl.appendChild(thEl);

   for (var i = 0; i < this.cookiesEachHr.length; i++) {
     tdEl = document.createElement('td');
     tdEl.textContent = this.cookiesEachHr[i];
     trEl.appendChild(tdEl);
   };
   storeTable.appendChild(trEl);
};
//
// new Store('1st and Pike', 23, 65, 6.3);
// new Store('Seatac International Airport', 3, 24, 1.2);
// new Store('Seattle Center', 11, 38, 3.7);
// new Store('Capitol Hill', 20, 38, 2.3);
// new Store('Alki Beach', 2, 16, 4.6);

function unRender() {
  document.getElementById('store-sales').innerText = '';

}
function formData(event) {
  event.preventDefault();

  var name = event.target.store.value;
  var minCust = parseInt(event.target.minCust.value);
  var maxCust = parseInt(event.target.maxCust.value);
  var avgCookie = parseInt(event.target.avgCookie.value);

  allStores.push(new Store(name, minCust, maxCust, avgCookie));
  unRender();
  renderHeaderRow();
  // renderStoreRows();
  renderFormRow();
  // renderFooterRow();
  form.reset();
}

function renderFormRow() {
  for(var i = 0; i < allStores.length; i++){
    allStores[i].render();
  };
}

function renderHeaderRow() {
  var trEl = document.createElement('tr');
  var tdEl = document.createElement('td');
  var thEl = document.createElement('th');
  tdEl.textContent = '';
  trEl.appendChild(tdEl);
  for (var i = 0; i < hours.length; i++) {
    thEl = document.createElement('th');
    thEl.textContent = hours[i];
    trEl.appendChild(thEl);
  };
  storeTable.appendChild(trEl);
}

function renderStoreRows(){
  for(var i = 0; i < allStores.length; i++){
    allStores[i].render();
  };
}

form.addEventListener('submit', formData);

// function renderFooterRow() {
//   var trEl = document.createElement('tr');
//   // var tdEl = document.createElement('td');
//   var thEl = document.createElement('th');
//   thEl.textContent = 'Hourly Totals:';
//   trEl.appendChild(thEl);
//   for (var i = 0; i < hours.length; i++) {
//     thEl = document.createElement('th');
//     thEl.textContent = 'Unk';
//     trEl.appendChild(thEl);
//   };
//   storeTable.appendChild(trEl);
// }
renderHeaderRow();
renderStoreRows();
// renderFooterRow();
