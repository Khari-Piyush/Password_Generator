// Fetching the slider 
const inputSlider = document.querySelector('[data-lengthSlider]');

// Fetching the slider number
const lengthDisplay = document.querySelector('[data-lengthNumber]');

// Fetching the password in Input box
const passwordDisplay = document.querySelector('[data-passwordDisplay]');

// copy button ko click karna fetch kar rhe hai
const copyBtn = document.querySelector('[data-copy]');
// Copy button ka jo message aayega usse fetch kar rhe hai ki password copy hogya
const copyMsg = document.querySelector('[data-copyMsg]');

const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numberCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');

// Jo indicator ki div hai usse fetch kar rhe hai
const indicator = document.querySelector('[data-indicator]');
//  Button click karne par password display hojaaye
const generateBtn = document.querySelector('.generateButton');

// Saare checkbox iss constant mai store ho jaayenge
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[]}:;"<,>.?/';


let password = "";
let passwordLength = 10;    
let checkCount = 0;
handleSlider();
// Strength circle color to gray
setIndicator("#ccc")
                
// Set passwordLength
function handleSlider() {
    // passwordLength ka kaam itna hai bas voh length ko ui par copy kardeta hai
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min) ) + "100%"
}

// Indicator
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    // Shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`
}
// Neeche wala function help karega koi bhi uppercase,lowercase char ko dhoondhne mai aur number ko bhi dhoondhne mai
function getRndInteger(min, max) {
    // Math.floor --> Round off the number.
    // Math,random --> Select any random number between 0 & 1.
    // Number between min max dega yeh
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    // charAt --.uss index par konsa element pada hai
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    // .checked property is to check if the checkbox is checked or not
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numberCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower & (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator('#ff0');
    } else {
        setIndicator('#f00');
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch (e) {
        copyMsg.innerText = "Failed";
    }
    // to make copied waala text visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array) {
    // Fisher yates Mathod
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}


function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });

    // Special Condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {
    // none of the chechbox are selected
    if (checkCount <= 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // lets start the journey to find new password


    // remove old password
    password = "";

    // lets put the stuff mentioned by checkbox
    // if (uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if (lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if (numberCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if (symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if (uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if (lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if (numberCheck.checked)
        funcArr.push(generateRandomNumber);

    if (symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //Compulsory Addition

    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // Remaining Addition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // Shuffle the password
    password = shufflePassword(Array.from(password));

    // show in ui
    passwordDisplay.value = password;

    // Calculate Strength
    calcStrength();

})