let equation = [];

const numberKey = document.querySelectorAll("button.numkey");

numberKey.forEach(function(key){
    key.addEventListener("click",function(){
            addNumber(key);
    });
});

const outputDisplay = document.querySelector("div#output-display");
const inputDisplay = document.querySelector("div#input-display");

//Update the display when number key is pressed
//BUG NOTE: sometimes when an answer has a decimal, it does not register as being true, and so user can add numbers onto the answer
function addNumber(key){
    const decimalKey = key.id === ".";
    const hasDecimal = inputDisplay.textContent.indexOf(".") !== -1;
    const zeroedDisplay = inputDisplay.textContent === "0";
    const undefinedResult = inputDisplay.textContent === "Undefined";
    const isAnswer = inputDisplay.textContent.indexOf(equation[0]) !== -1;
    const operatorSign = inputDisplay.textContent[0];
    const hasOperator = /[-+\*\/]/.test(inputDisplay.textContent) === true;
 
 
    if(decimalKey && hasDecimal){
        //Do not allow decimal input 
        return
    }else if(zeroedDisplay || undefinedResult){
        inputDisplay.textContent = key.id;
    }else if(isAnswer){
        outputDisplay.textContent = "\u00A0";
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
        const undefinedResult = inputDisplay.textContent === "Undefined";
        clearDisplay(key);
        if(!undefinedResult){
            addOperator(key);
        }
        calculateEquation(key);
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
//BUG NOTE: operators can be added after a decimal is input
//Check if each decimal has a number after it
//BUG NOTE: operators aren't able to be pressed when an answer comes out as a negative
function addOperator(key){
    let currentInput = inputDisplay.textContent;
    const operatorKey = key.classList.contains("operator");
    const hasOperator = /[-+\*\/]/.test(inputDisplay.textContent) === true;

    if(operatorKey && !hasOperator){

        //Only push numbers to equation array if they are input by user
        if(equation.length !== 1){
            outputDisplay.textContent += currentInput;
            pushNumbersToEquation();
        }else{
            outputDisplay.textContent = currentInput;
        };

        inputDisplay.textContent = key.id;
        pushOperatorToEquation(key);
    };
};

function pushNumbersToEquation(){
    equation.push(+inputDisplay.textContent);
};

function pushOperatorToEquation(key){
    equation.push(key.id);
};

//Calculate equation using PEMDAS and update display with result
//BUG NOTE: if user forgets to put number after decimal, calculation can still be run causing a NaN error
function calculateEquation(key){
    const equalKey = key.id === "=";
    let currentInput = inputDisplay.textContent;
    const emptyEquation = equation.length === 0;
    const operatorOnly = /[-+\*\/]/.test(inputDisplay.textContent) === true;
    const previousAnswer = outputDisplay.textContent.indexOf("=") !== -1;
    
    if(equalKey && !emptyEquation && !previousAnswer && !operatorOnly){
        pushNumbersToEquation();
        outputDisplay.textContent += currentInput + "=";
        const hasDivByZero = /(\/0).*/.test(outputDisplay.textContent) === true;
        
        if(hasDivByZero){
            equation.length = 0;
            inputDisplay.textContent = "Undefined"
            outputDisplay.textContent = "\u00A0";
        }else{
            pemdas();
            displayAnswer();
            updateResultHistory();
        };
    };

};

function pemdas(){
    while(equation.length !==1){
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
    };
    };
    
  };

function multiply(){
    let index = equation.indexOf("*");
    let result = equation[index - 1] * equation[index + 1];

    updateEquation(index,result);
  };

function divide(){
    let index = equation.indexOf("/");
    let result = equation[index - 1] / equation[index + 1];

    updateEquation(index,result);
  };

function add(){
    let index = equation.indexOf("+");
    let result = equation[index - 1] + equation[index + 1];

    updateEquation(index,result);
  };

  function minus(){
    let index = equation.indexOf("-");
    let result = equation[index - 1] - equation[index + 1];

    updateEquation(index,result);
  };

  function updateEquation(index,result){
    if(index !== -1){
        equation.splice(index-1,3,result)
        };
  };

  function displayAnswer(){
    const hasDecimal = /(\.)/.test(equation[0]) === true;
    let answer = equation[0];

    hasDecimal ? inputDisplay.textContent = `${answer.toFixed(3)}` : inputDisplay.textContent = `${answer}`;
  };

  const resultHistory = document.querySelector("div#results");

  function updateResultHistory(){
    let finalEquation = document.createTextNode(`${outputDisplay.textContent}`);
    let answer = document.createTextNode(`${inputDisplay.textContent}`);
    let prevResult = resultHistory.firstChild;
    const newResult = document.createElement("div");
    const equationDiv = document.createElement("div");
    const answerDiv = document.createElement("div");

    newResult.classList.add("result-item");
    equationDiv.classList.add("result-equation");
    equationDiv.appendChild(finalEquation);
    answerDiv.classList.add("result-answer");
    answerDiv.appendChild(answer);

    resultHistory.insertBefore(newResult,prevResult);
    newResult.append(equationDiv,answerDiv);

  }