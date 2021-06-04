/* 選擇器 */
let height = document.querySelector('#height'); //身高
let weight = document.querySelector('#weight'); //體重
const heightVerifi = document.querySelector('.height-verifi'); //身高驗證
const weightVerifi = document.querySelector('.weight-verifi'); //體重驗證
const resultBtn = document.querySelector('.result-btn'); //看結果按鈕
const stateBtn = document.querySelector('.state-btn'); //狀態按鈕
const clearAllBtn = document.querySelector('.clear-all'); //清除全部
const delBtn = document.querySelector('.del-btn'); //垃圾桶刪除
const resultList = document.querySelector('.result-body'); //結果列表
const bmiText = document.querySelector('.bmi');//bmi 運算文字
const weightText = document.querySelector('.weight');//weight 輸入文字
const heightText = document.querySelector('.height');//height 輸入文字
const dateText = document.querySelector('.date');//今日日期
const form = document.querySelector('form');//
let dataArry = JSON.parse(localStorage.getItem('bmiData')) || [];

printBmiCard(dataArry); //初始將資料印出

/*表單驗證*/
function inputNoData(e){
    if(height.value == ''){
        heightVerifi.textContent = '！此欄位不能為空白';
    }else{
        heightVerifi.textContent = '';
    }
    
    if(weight.value == ''){
        weightVerifi.textContent = '！此欄位不能為空白';   
    }else{
        weightVerifi.textContent = '';
    }
}
height.addEventListener('blur',inputNoData);
weight.addEventListener('blur',inputNoData);

/*計算 bmi*/
function printBmi(){
    // bmi 公式
    let cm = height.value;
    let kg = weight.value;
    const bmi = (kg/(cm/100)**2).toFixed(2);

    //判斷 bmi 狀態
    if(bmi == 'NaN' || bmi == 0){
        inputNoData();
        return;
    }else if(bmi<18.5){
        bmiState = '過輕';
        color = '#31BAF9';
    }else if(18.5<=bmi && bmi<24){
        bmiState = '理想';
        color = '#86D73E';
    }else if(24<=bmi && bmi<27){
        bmiState = '過重';
        color = '#FF982D';
    }else if(27<=bmi && bmi<30){
        bmiState = '輕度肥胖';
        color = '#FF6C02';
    }else if(30<=bmi && bmi<35){
        bmiState = '中度肥胖';
        color = '#FF6C02';
    }else if(bmi>=35){
        bmiState = '重度肥胖';
        color = '#FF1200';
    }
    form.reset();//清除表單資料
    
    let newItem = {
        bmi:bmi,
        weight:kg,
        height:cm,
        state:bmiState,
        color:color,
        date:new Date().toLocaleDateString()
    }

    dataArry.unshift(newItem); //unshift 到陣列 (新增到第一筆)
    localStorage.setItem('bmiData',JSON.stringify(dataArry));//將 dataArry 存入 localStorage ，並轉換成字串
    printBmiCard(dataArry);

    //按鈕轉換
    function btnTran(){
        resultBtn.classList.add('d-none');
        stateBtn.classList.add('d-block');
        stateBtn.classList.remove('d-none');
        stateBtn.setAttribute('style',`border:5px solid ${newItem.color}`);

        let btnContent = `<p style="color:${newItem.color}">${newItem.bmi}</p>
        <p class="bmi-text" style="color:${newItem.color}">BMI</p>
        <span class="reset-btn" style="background:${newItem.color}"><img src="img/icon-loop.png"></span>`;
        stateBtn.innerHTML = btnContent;
    }
    btnTran();
}



//渲染資料
function printBmiCard(e){
    let str = '';
    dataArry.forEach(function(item,index){
        let content = `<li class="result-card" style="border-left:7px solid ${item.color};">
    <h3 class="state">${item.state}</h3>
    <div class="result">
        <p class="bmi"><span>BMI</span>${item.bmi}</p>
        <p class="weight"><span>weight</span>${item.weight}kg</p>
        <p class="height"><span>height</span>${item.height}cm</p>
    </div>
    <p class="date">${item.date}</p>
    <button class="del-btn"><i class="fas fa-trash" data-num="${index}"></i></button>
</li>`;
    str+=content;
    });
    resultList.innerHTML = str;
}

// bmi 狀態按鈕轉換
function resetStateBtn(){
    this.classList.add('d-none');
    this.classList.remove('d-block');
    resultBtn.classList.add('d-block');
    resultBtn.classList.remove('d-none');
}

//清除單筆資料
function delData(e){
    if(e.target.nodeName !== 'I'){
        return;
    }
    let itemNum = e.target.dataset.num;
    dataArry.splice(itemNum,1);
    localStorage.setItem('bmiData', JSON.stringify(dataArry));
    printBmiCard(dataArry);
}

//清除全部資料
function delAllData(e){
    e.preventDefault();
    dataArry = []; //變空陣列
    localStorage.setItem('bmiData', JSON.stringify(dataArry));
    printBmiCard(dataArry);
}

resultBtn.addEventListener('click',printBmi);
stateBtn.addEventListener('click',resetStateBtn);
resultList.addEventListener('click',delData);
clearAllBtn.addEventListener('click',delAllData);