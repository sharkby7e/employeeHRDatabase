const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

const openDB = () => {
  console.log(`
                       __                               __         
.-----.--------.-----.|  |.-----.--.--.-----.-----.    |  |--.----.
|  -__|        |  _  ||  ||  _  |  |  |  -__|  -__|    |     |   _|
|_____|__|__|__|   __||__||_____|___  |_____|_____|    |__|__|__|  
    __         |__|        __   |_____|                            
.--|  |.---.-.|  |_.---.-.|  |--.---.-.-----.-----.                
|  _  ||  _  ||   _|  _  ||  _  |  _  |__ --|  -__|                
|_____||___._||____|___._||_____|___._|_____|_____|                
                                                                   
    `);
  mainMenu();
};

const db = mysql.make;

const mainMenu = () => {
  inquirer
    .prompt([
      {
        message: "\nMain Menu\nWhat would you like to do?",
        type: "list",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
        ],
        name: "choice",
      },
    ])
    .then((answers) => {
      switch (answers.choice) {
        case "View all departments":
          viewOnly("departments");
          break;
        case "View all roles":
          viewOnly("roles");
          break;
        case "View all employees":
          viewOnly("employees");
          break;
        case "Add a department":
          add("department");
          break;
        case "Add a role":
          add("role");
          break;
        case "Add an employee":
          add("employee");
          break;
        case "Update an employee role":
          updateEmployee();
          break;
      }
    });
};

function updateEmployee() {}
function add(whatAdd) {}
function viewOnly(whatView) {}

openDB();
