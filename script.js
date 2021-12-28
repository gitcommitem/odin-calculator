const numberKey = document.querySelectorAll("button.numkey");
const modiferKey = document.querySelectorAll("button.modifer");
const display = document.querySelector("div#display");
const resultHistory = document.querySelector("div#results");

const operators = {
    add: "+",
    minus: "-",
    times: "*",
    divide: "/",
    equals: "="
}

const equation = [];

numberKey.forEach(function(key){
    key.addEventListener("click",function(){
        addNumber(key);
        console.log(key.id);
    });
});

modiferKey.forEach(function(key){
    key.addEventListener("click",function(){
        clearDisplay(key);
        addOperator(key);
        console.log(key.id);
    });
});


//Update the display when number key is pressed
function addNumber(key){
    const zeroedDisplay = display.textContent === "0";
    const decimalKey = key.id === ".";
    let hasDecimal = display.textContent.indexOf(".") !== -1;

    if(decimalKey && hasDecimal || decimalKey && zeroedDisplay){
        return
    }else if(zeroedDisplay){
        display.textContent = key.id;
    }else{
        display.textContent += key.id;
    };
};

//Zero the display when clear key is pressed
function clearDisplay(key){
    const clearKey = key.id === "clear";
    if(clearKey){
        display.textContent = 0;
    };
};

//Update display when operator key is pressed
function addOperator(key){
    if(key.classList.contains("operator")){
        display.textContent += operators[key.id];
    }
}