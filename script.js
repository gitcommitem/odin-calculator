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
//BUG NOTE: user can add numbers on to a computed result
function addNumber(key){
    const decimalKey = key.id === ".";
    const hasDecimal = inputDisplay.textContent.indexOf(".") !== -1;
    const zeroedDisplay = inputDisplay.textContent === "0";
    const operatorSign = inputDisplay.textContent[0];
    const hasOperator = /[-+\*\/]/.test(inputDisplay.textContent) === true;
 
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

//Zero both displays and equation when clear key is pressed
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

        //Only push numbers to equation array if they are input by user
        if(equation.length !== 1){
            outputDisplay.textContent += currentInput;
            pushNumbersToEquation();
        }else{
            outputDisplay.textContent = currentInput;
        }

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

//Calculate equation using PEMDAS and update display with result
//BUG NOTE: Will crash if equal pressed with nothing in the equation or no operator in equation
//BUG NOTE: computations that have long decimals need to be rounded off to 3 points
//BUG NOTE: Will crash if user tries to divide by zero
function calculateEquation(key){
    const equalKey = key.id === "=";
    let currentInput = inputDisplay.textContent;
    
    if(equalKey){
        pushNumbersToEquation();
        console.log(equation);
        outputDisplay.textContent += currentInput + "=";
        pemdas();
        inputDisplay.textContent = `${equation}`;
    }
}

function pemdas(){
    while(equation.length !==1 ){
      let indexOfMultiply = equation.indexOf("*");
      const hasMultiply = equation.indexOf("*") !== -1;
      let indexOfDivide = equation.indexOf("/");
      const hasDivide = equation.indexOf("/") !== -1;
      let indexOfAdd = equation.indexOf("+");
      const hasAdd = equation.indexOf("+") !== -1;
      let indexOfMinus = equation.indexOf("-");
      const hasMinus = equation.indexOf("-") !== -1;

      //Run math operations using PEMDAS, with priority of left to right
      if(hasMultiply && indexOfMultiply < indexOfDivide){
        multiply();
      }else if(hasDivide && indexOfDivide < indexOfMultiply){
        divide();
      }else if(hasAdd && indexOfAdd < indexOfMinus){
        add();
      }else if(hasMinus && indexOfMinus < indexOfAdd){
        minus();
      }
      else{
        multiply();
        divide();
        add();
        minus();
    }
    }
    
  }

function multiply(){
    let index = equation.indexOf("*");
    let result = equation[index - 1] * equation[index + 1];

    updateEquation(index,result);
  }

function divide(){
    let index = equation.indexOf("/");
    let result = equation[index - 1] / equation[index + 1];

    updateEquation(index,result);
  }

function add(){
    let index = equation.indexOf("+");
    let result = equation[index - 1] + equation[index + 1];

    updateEquation(index,result);
  }

  function minus(){
    let index = equation.indexOf("-");
    let result = equation[index - 1] - equation[index + 1];

    updateEquation(index,result);
  }

  function updateEquation(index,result){
    if(index !== -1){
        equation.splice(index-1,3,result)
        }
  }