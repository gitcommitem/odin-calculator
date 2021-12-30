let equation = [];

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
    const hasOperator = isNaN(inputDisplay.textContent) === true;
 
    if(decimalKey && hasDecimal){
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
        calculateEquation(key);
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
        pushNumbersToEquation();
        inputDisplay.textContent = key.id;
        pushOperatorToEquation(key);
        console.log(equation);
    };
};

function pushNumbersToEquation(){
    equation.push(+inputDisplay.textContent);
};

function pushOperatorToEquation(key){
    equation.push(key.id);
};


//BUG NOTE: equations currently only compute properly if all the same operator
//Mixing of operations in an equation returns as NaN at the moment
//Ex: 6+6-3 = NaN
function calculateEquation(key){
    const equalKey = key.id === "=";
    let currentInput = inputDisplay.textContent;
    
    if(equalKey){
        pushNumbersToEquation();
        console.log(equation);
        outputDisplay.textContent += currentInput + "=";

        for(let i = 0; i < equation.length + 1; i++){
            let indexOfMultiply = equation.indexOf("*");
            let indexOfDivide = equation.indexOf("/");
            let indexOfAdd = equation.indexOf("+");
            let indexOfMinus = equation.indexOf("-");
                multiply(indexOfMultiply);
                divide(indexOfDivide);
                add(indexOfAdd);
                minus(indexOfMinus);
        }

        console.log(equation);
        inputDisplay.textContent = `${equation}`;

    }
}

//BUG NOTE: multiply breaks if there are 6+ numbers in an equation
//Ex: 2*6*5*4*3*9
//Result shows as 720, *, 9
//It's not reaching the last iteration --> adjust for loop...?
//Increasing for look equation.length helps but it's only temp/up to where the break point was
//Setting a limit like equation.length + 99 is hacky but works
//Might be because it's also running all the other equations which eat up an iteration...?
function multiply(indexOfMultiply){
    if(indexOfMultiply !== -1){
        let result = equation[indexOfMultiply - 1] * equation[indexOfMultiply + 1];
        equation.splice(indexOfMultiply - 1, 3, result);
    }
}

//BUG NOTE: divide breaks if there are 5+ numbers in an equation
//Ex: 160/2/2/2/2/2
//Result shows as 10,/,2
function divide(indexOfDivide){
    if(indexOfDivide !== -1){
        let result = equation[indexOfDivide - 1] / equation[indexOfDivide + 1];
        equation.splice(indexOfDivide- 1, 3, result);
    }
}

//BUG NOTE: Add breaks if there are too many numbers in an equation
function add(indexOfAdd){
    if(indexOfAdd !== -1){
        let result = equation[indexOfAdd - 1] + equation[indexOfAdd + 1];
        equation.splice(indexOfAdd - 1, 3, result);
    }
}

function minus(indexOfMinus){
    if(indexOfMinus !== -1){
        let result = equation[indexOfMinus - 1] - equation[indexOfMinus + 1];
        equation.splice(indexOfMinus - 1, 3, result);
    }
}
