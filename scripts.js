const showCost = document.getElementById("cost");
const time_remain = document.getElementById("time_remain");
const coin_time = document.getElementById("coin_time")
const buy = document.getElementById("buy");
const sell = document.getElementById("sell");
const showMoney = document.getElementById("money");
const showMaxCoin = document.getElementById("max_coin");
const now_coin = document.getElementById("now_coin");
const warn = document.getElementById("warn");
const retry = document.getElementById("retry");
const displayPerc = document.getElementById("displayPerc")

let money = 10000; //소지금
let cost = 100; //초기 가격
let myCoin = 0; //보유 코인
let max_coin = 20;
let end_time = 300;
let end_coin_time = 3;
let buyingInterval;
let sellingInterval;
let rapidBuyingTimeout;
let rapidSellingTimeout;

function randomCost() { //변동 폭 함수
  let plus_minus = [1, -1]; //증감
  let perc = Math.random(); //0~100% 사이의 배율
  let showPerc = Math.floor(perc * 100); //표시용 퍼센트
  let plusOrMinus = Math.floor(Math.random() * 2); //randint(0,1)
  showPerc = String(showPerc) + "%";

  perc = perc * plus_minus[plusOrMinus] + 1; //증감 결정, 마이너스 배율을 플러스 배율만큼 변화(10%감소 = 90%변화)
  cost *= perc //가격 변동
  cost = Math.floor(cost) //소수점 없애기
  max_coin = Math.floor(money / cost); //최대 매수 가능 수량
  if (cost <= 100) {    //시세 100이상 고정
    // cost = Math.floor(Math.random() * 21) + 100; //시세 100~120 사이의 랜덤 값으로 변경
    cost = 100;
    max_coin = Math.floor(money / cost); // 바뀐 값 저장
    // displayPerc.style.color = "gray";
    // displayPerc.textContent = "보정됨";
    showMaxCoin.textContent = `최대 매수 가능 수량 : ${max_coin}`;
  }
  if (plus_minus[plusOrMinus] === 1) {
    displayPerc.style.color = "red";
    displayPerc.textContent = `▲${showPerc}`;
    showMaxCoin.textContent = `최대 매수 가능 수량 : ${max_coin}`;
  }
  else {
    displayPerc.style.color = "blue";
    displayPerc.textContent = `▼${showPerc}`;
    showMaxCoin.textContent = `최대 매수 가능 수량 : ${max_coin}`;
  }
  showCost.textContent = `코인 시세\n${cost}`//변동된 가격 보여주기
};

function buyCoin() {    //매수로직
  if (money >= cost) { //돈 확인
    money -= cost; //가격만큼 돈 감소
    myCoin += 1; //코인 추가
    max_coin = Math.floor(money / cost); //최대 매수 가능 수량
    showMoney.textContent = `소지금 : ${money}`
    now_coin.textContent = `보유 중인 코인 수 : ${myCoin}`;
    showMaxCoin.textContent = `최대 매수 가능 수량 : ${max_coin}`;
  }
  else { //보유 중인 돈이 시세보다 적은 경우
    warn.style.visibility = "visible";//경고문 사라지지 않게
    warn.textContent = "매수 가능한 코인이 없습니다!";
    setTimeout(() => {
      warn.style.visibility = "hidden"; //1초 지난 후에 없애기
    }, 1000); // 1000ms = 1초
  }
}

function sellCoin() {   //매도로직
  if (myCoin !== 0) { //돈 확인
    money += cost; //가격만큼 돈 증가
    myCoin -= 1; //코인 감소
    max_coin = Math.floor(money / cost); //최대 매수 가능 수량
    showMoney.textContent = `소지금 : ${money}`
    now_coin.textContent = `보유 중인 코인 수 : ${myCoin}`;
    showMaxCoin.textContent = `최대 매수 가능 수량 : ${max_coin}`;
  }
  else { //보유 중인 코인이 없는 경우
    warn.style.visibility = "visible";
    warn.textContent = "매도 가능한 코인이 없습니다!";
    setTimeout(() => {
      warn.style.visibility = "hidden";
    }, 1000); // 1000ms = 1초
  }
}

function startBuying(){
  buyCoin();
  rapidBuyingTimeout = setTimeout(function() {
    buyingInterval = setInterval(buyCoin, 50);
  }, 60);
}

function stopBuying(){
  clearInterval(buyingInterval);
  clearInterval(rapidBuyingTimeout);
}

function startSelling(){
  sellCoin();
  rapidSellingTimeout = setTimeout(function() {
    sellingInterval = setInterval(sellCoin, 50);
  }, 60);
}

function stopSelling(){
  clearInterval(sellingInterval);
  clearInterval(rapidSellingTimeout);
}

function updateTimer() {    //타이머
  end_time--;   //게임종료시간 1초까기
  end_coin_time--;    //시세변동시간 1초까기
  time_remain.textContent = `게임 종료까지 ${end_time}초`;
  coin_time.textContent = `코인 시세 변동까지 ${end_coin_time}초`;

  if (end_time <= 0) {   //게임종료
    clearInterval(timerInterval);
    clearInterval(coinPriceInterval);
    clearInterval(coinPriceInterval);

    buy.style.display = "none";
    sell.style.display = "none";
    retry.style.display = "block";
    showCost.style.fontSize = "3vmax";
    showCost.textContent = `게임 종료!\n모은 돈 : ${money}`;
  }
  if (end_coin_time <= 0) {   //코인시세바뀜
    end_coin_time = 3;
  }
}

function timerStart() {   // 타이머와 코인 시세 업데이트 시작
  timerInterval = setInterval(updateTimer, 1000); // 1초마다 타이머 업데이트
  coinPriceInterval = setInterval(randomCost, 3000);
} // 3초마다 코인 시세 업데이트 

retry.onclick = function () {   //다시버튼 눌렀을때
  buy.style.display = "block";
  sell.style.display = "block";
  retry.style.display = "none";
  money = 10000;
  myCoin = 0;
  showMoney.textContent = `소지금 : ${money}`
  now_coin.textContent = `보유 중인 코인 수 : ${myCoin}`;
  showMaxCoin.textContent = `최대 매수 가능 수량 : ${max_coin}`;
  end_coin_time = 3;
  end_time = 3;
  timerStart(); //게임 재시작
  randomCost(); //시세 변동
}

randomCost(); //게임 시작 시 바로 변동
timerStart(); //게임 시작

document.addEventListener('dblclick', function (event) {
  event.preventDefault(); // 더블 클릭 시 확대 방지
});

document.addEventListener('touchstart', function (event) {
  event.preventDefault(); // 길게 눌러서 선택하기 방지
});

buy.addEventListener("mousedown", startBuying);
buy.addEventListener("mouseup", stopBuying);
buy.addEventListener("mouseleave", stopBuying);
sell.addEventListener("mousedown", startSelling);
sell.addEventListener("mouseup", stopSelling);
sell.addEventListener("mouseleave",stopSelling);

//모바일용
buy.addEventListener("touchstart", startBuying);
buy.addEventListener("touchend", stopBuying);
buy.addEventListener("touchcancel", stopBuying);
sell.addEventListener("touchstart", startBuying);
sell.addEventListener("touchend", stopSelling);
sell.addEventListener("touchcancel", stopSelling);
