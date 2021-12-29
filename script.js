const listOfOperators = ["+","-","*","/","="];

const operators = {
    add: "+",
    minus: "-",
    times: "*",
    divide: "/",
    equals: "="
}

const equation = [];

const numberKey = document.querySelectorAll("button.numkey");

numberKey.forEach(function(key){
    key.addEventListener("click",function(){
        addNumber(key);
        console.log(key.id);
    });
});

const outputDisplay = document.querySelector("div#output-display");
const inputDisplay = document.querySelector("div#input-display");
const resultHistory = document.querySelector("div#results");

//Update the display when number key is pressed
function addNumber(key){
    const decimalKey = key.id === ".";
    const hasDecimal = inputDisplay.textContent.indexOf(".") !== -1;
    const zeroedDisplay = inputDisplay.textContent === "0";
    const operatorSign = inputDisplay.textContent[0];
    const hasOperator = inputDisplay.textContent.indexOf(...listOfOperators) === 0;
 
    if(decimalKey && hasDecimal || decimalKey && zeroedDisplay){
        //Do not allow decimal input 
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

const modiferKey = document.querySelectorAll("button.modifer");

modiferKey.forEach(function(key){
    key.addEventListener("click",function(){
        clearDisplay(key);
        addOperator(key);
        console.log(key.id);
    });
});

//Zero both displays when clear key is pressed and clear equation
function clearDisplay(key){
    const clearKey = key.id === "clear";

    if(clearKey){
        equation.length = 0;
        inputDisplay.textContent = 0;
        outputDisplay.textContent = "\u00A0";
    };
};

//Update display when operator key is pressed
function addOperator(key){
    let currentInput = inputDisplay.textContent;

    if(key.classList.contains("operator")){
        outputDisplay.textContent += currentInput;
        equation.push(inputDisplay.textContent);
        inputDisplay.textContent = operators[key.id];
        equation.push(operators[key.id]);
        console.log(equation);
    };
};

