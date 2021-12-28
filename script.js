const numberKey = document.querySelectorAll("button.numkey");
const modiferKey = document.querySelectorAll("button.modifer");
const outputDisplay = document.querySelector("div#output-display");
const inputDisplay = document.querySelector("div#input-display");
const resultHistory = document.querySelector("div#results");

const listOfOperators = ["+","-","*","/","="];

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
    const zeroedDisplay = inputDisplay.textContent === "0";
    const operatorSign = inputDisplay.textContent[0];
    const hasOperator = inputDisplay.textContent.indexOf(...listOfOperators) === 0;
    const decimalKey = key.id === ".";
    let hasDecimal = inputDisplay.textContent.indexOf(".") !== -1;

    if(decimalKey && hasDecimal || decimalKey && zeroedDisplay){
        return
    }else if(zeroedDisplay){
        inputDisplay.textContent = key.id;
    }else if(hasOperator){
        outputDisplay.textContent += operatorSign;
        inputDisplay.textContent = key.id;
    }
    else{
        inputDisplay.textContent += key.id;
    };
};

//Zero both displays when clear key is pressed
function clearDisplay(key){
    const clearKey = key.id === "clear";
    if(clearKey){
        inputDisplay.textContent = 0;
        outputDisplay.textContent = "\u00A0";
    };
};

//Update display when operator key is pressed
function addOperator(key){
    if(key.classList.contains("operator")){
        let currentInput = inputDisplay.textContent;
        outputDisplay.textContent += currentInput;
        equation.push(inputDisplay.textContent);
        inputDisplay.textContent = operators[key.id];
        equation.push(operators[key.id]);
        console.log(equation);
    };
};

