const fs = require('fs'); //Importing Required Packages
const util = require('util');
const readFile = util.promisify(fs.readFile);
let finalOutput = "SPACE ";

function caesarDecryption(str, amount) { //function to decrypt caesar's encrypted string   
    var output = "";
    for (var i = 0; i < str.length; i++) {
        var c = str[i];
        var code = str.charCodeAt(i);
        if (code >= 65 && code <= 90) { //checks for upper case letters
            c = String.fromCharCode(((code - 65 + (26 - amount)) % 26) + 65);
        } else if (code >= 97 && code <= 122) { //checks for lowercase letters
            c = String.fromCharCode(((code - 97 + (26 - amount)) % 26) + 97);
        }
        output += c;
    }
    return output;
};

function strCompare(decryptedStr, emblem) { //string comparison between decrypted string and emblem of kingdom
    var i = 0;
    let arr = [];
    for (i = 0; i < decryptedStr.length; i++) {
        arr[decryptedStr[i]] = (arr[decryptedStr[i]] || 0) + 1;
    }
    for (i = 0; i < emblem.length; i++) {
        arr[emblem[i]] = (arr[emblem[i]] || 0) - 1;
        if (arr[emblem[i]] < 0) {
            return false;
        }
    }
    return true;
}

function msgDecryption(kingdom, encryptedStr) { //function to decrypt message
    let str, len, pos;
    let kingdomEmblemObj = { //object constituting of kingdom as Key and Emblem as Value
        "space": "gorilla",
        "water": "octopus",
        "land": "panda",
        "air": "owl",
        "ice": "mammoth",
        "fire": "dragon"
    };
    Object.keys(kingdomEmblemObj).forEach((key, index) => {
        if (kingdom.toLowerCase() == key) //find instance with selected kingdom as key in the object
        {
            len = kingdomEmblemObj[key].length;
            pos = key;
        }
    });
    str = caesarDecryption(encryptedStr, len);
    if (strCompare(str.toLowerCase().trim(), kingdomEmblemObj[pos])) { //get output string with ruler and all allies
        finalOutput = finalOutput + pos.toUpperCase() + " "
    }
}

function thameOfThrones() { // retrieve the file path as command line arguments
    var cmdArg = process.argv[2];
    if(process.argv[3])
    throw new Error('Invalid Parameter Value')
    return readFile(cmdArg);
}
/*to generate input array constituting of Kingdom as Key and 
Encrypted string as Value in each instance from the data retrieved
from the input file and retrieving final output string 
*/
thameOfThrones().then(data => {
        let inputArr = [];
        let inputContent = data.toString().split("\n");
        inputContent.filter(line => {
            line = line.trim().split(" ");
            let firstWord = line[0];
            line.splice(0, 1);
            let secondWord = line.join(" ").trim();
            let instance = {
                [firstWord]: secondWord
            };
            inputArr.push(instance);
        })
        try {
            inputArr.forEach(item => {
                msgDecryption(Object.keys(item)[0], item[Object.keys(item)[0]]);
            })
            finalOutput = finalOutput.trim();
            if (finalOutput.split(" ").length < 4) // check if the number of allies is less than 3 if so set output to NONE
                finalOutput = "NONE"
            console.log(finalOutput);
        } catch (e) {
            console.log("Invalid Input Data");
        }
    })
    .catch(err => {
        console.log("Invalid File Path");
        console.log(err)
    })
thameOfThrones();