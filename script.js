let equation = [];

const numberKey = document.querySelectorAll("button.numkey");

numberKey.forEach(function(key){
    key.addEventListener("click",function(){
        const decimalKey = key.id === ".";

        if(decimalKey){
            addDecimal(key);
        };

        if(!decimalKey){
            addNumber(key);
        };
    });
});

const outputDisplay = document.querySelector("div#output-display");
const inputDisplay = document.querySelector("div#input-display");

let isAnswerDisplayed = false;
let isDecimalCurrentInput = false;
let isOperatorCurrentInput = false;

function addDecimal(key){
    const hasDecimal = inputDisplay.textContent.indexOf(".") !== -1;
    const zeroedDisplay = inputDisplay.textContent === "0";
    const undefinedResult = inputDisplay.textContent === "Undefined";

    if(hasDecimal && isAnswerDisplayed === false){
        //Do not allow decimal input
        return
    };

    if(undefinedResult){
        inputDisplay.textContent = key.id;
    } 
    else if(zeroedDisplay || isAnswerDisplayed === true){
        replaceAnswer(key);
    }
    else if(isOperatorCurrentInput === true){
        replaceOperator(key);
    }
    else{
        inputDisplay.textContent += key.id;
    };

    isDecimalCurrentInput = true;
};

function replaceAnswer(key){
    equation.length = 0;
    outputDisplay.textContent = "\u00A0";
    inputDisplay.textContent = key.id;
    isAnswerDisplayed = false;
};

function replaceOperator(key){
    const operatorSign = inputDisplay.textContent[0];

    outputDisplay.textContent += operatorSign;
    inputDisplay.textContent = key.id;
    isOperatorCurrentInput = false;
};

function addNumber(key){
    const zeroedDisplay = inputDisplay.textContent === "0";
    const undefinedResult = inputDisplay.textContent === "Undefined";
     
    if(undefinedResult){
        inputDisplay.textContent = key.id;
    }
    else if(zeroedDisplay || isAnswerDisplayed === true){
        replaceAnswer(key);
    }
    else if(isOperatorCurrentInput === true){
        replaceOperator(key);
    }
    else{
        inputDisplay.textContent += key.id;
        isDecimalCurrentInput = false;
    };
};

const modiferKey = document.querySelectorAll("button.modifer");

modiferKey.forEach(function(key){
    key.addEventListener("click",function(){
        const clearKey = key.id === "clear";
        const operatorKey = key.classList.contains("operator");
        const equalKey = key.id === "=";

        if(clearKey){
            clearAll();
        };

        if(operatorKey){
            addOperator(key);
        };

        if(equalKey){
            calculateEquation();
        };
    });
});

function clearAll(){
        equation.length = 0;
        inputDisplay.textContent = 0;
        outputDisplay.textContent = "\u00A0";
        isAnswerDisplayed = false;
        isDecimalCurrentInput = false;
        isOperatorCurrentInput = false;
};

function addOperator(key){
    let currentInput = inputDisplay.textContent;

    const undefinedResult = inputDisplay.textContent === "Undefined";

    if(!undefinedResult && isOperatorCurrentInput === false && isDecimalCurrentInput === false){

        //Only push numbers to equation array if they are input by user
        if(isAnswerDisplayed === false){
            outputDisplay.textContent += currentInput;
            pushNumbersToEquation();
        }
        else{
            outputDisplay.textContent = currentInput;
        };

        inputDisplay.textContent = key.id;
        isOperatorCurrentInput = true;
        isAnswerDisplayed = false;
        pushOperatorToEquation(key);
    };
};

function pushNumbersToEquation(){
    equation.push(+inputDisplay.textContent);
};

function pushOperatorToEquation(key){
    equation.push(key.id);
};

function calculateEquation(){
    let currentInput = inputDisplay.textContent;
    
    if(isAnswerDisplayed === false && isOperatorCurrentInput === false && isDecimalCurrentInput === false){
        pushNumbersToEquation();
        
        outputDisplay.textContent += currentInput + "=";
        const hasDivByZero = /(\/0).*/.test(outputDisplay.textContent) === true;
        
        if(hasDivByZero){
            equation.length = 0;
            inputDisplay.textContent = "Undefined"
            outputDisplay.textContent = "\u00A0";
        }
        else{
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

      //Run math operations using PEMDAS logic
      if(hasMultiply && indexOfMultiply < indexOfDivide || hasMultiply && hasAdd || hasMultiply && hasMinus){
        multiply();
      }
      else if(hasDivide && indexOfDivide < indexOfMultiply || hasDivide && hasAdd || hasDivide && hasMinus){
        divide();
      }
      else if(hasAdd && indexOfAdd < indexOfMinus){
        add();
      }
      else if(hasMinus && indexOfMinus < indexOfAdd){
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
    let answer = equation[0];
    const hasDecimal = /(\.)/.test(equation[0]) === true;

    hasDecimal ? inputDisplay.textContent = `${answer.toFixed(3)}` : inputDisplay.textContent = `${answer}`;
    isAnswerDisplayed = true;
  };

  const resultHistory = document.querySelector("div#results");

  function updateResultHistory(){
    let finalEquation = document.createTextNode(`${outputDisplay.textContent}`);
    let answer = document.createTextNode(`${inputDisplay.textContent}`);
    let prevResult = resultHistory.firstChild;

    const newResultDiv = document.createElement("div");
    const equationDiv = document.createElement("div");
    const answerDiv = document.createElement("div");

    newResultDiv.classList.add("result-item");

    equationDiv.classList.add("result-equation");
    equationDiv.appendChild(finalEquation);

    answerDiv.classList.add("result-answer");
    answerDiv.appendChild(answer);

    resultHistory.insertBefore(newResultDiv,prevResult);
    newResultDiv.append(equationDiv,answerDiv);

  };