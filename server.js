// const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");
const { prompt } = require("inquirer");

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

async function viewOnly(whatView) {
  const mysql = require("mysql2/promise");
  const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "employeeHR_db",
  });
  const rows = await conn.execute("select * from ?", whatView);
  console.log(cTable(rows));
  await conn.end();
}
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   database: "employeeHR_db",
//   password: "password",
// });

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
          "Exit",
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
        case "Exit":
          showExitScreen();
          break;
        default:
          break;
      }
    });
};

function showExitScreen() {
  console.log(`Thanks for using the\n
                       __                               __         
.-----.--------.-----.|  |.-----.--.--.-----.-----.    |  |--.----.
|  -__|        |  _  ||  ||  _  |  |  |  -__|  -__|    |     |   _|
|_____|__|__|__|   __||__||_____|___  |_____|_____|    |__|__|__|  
    __         |__|        __   |_____|                            
.--|  |.---.-.|  |_.---.-.|  |--.---.-.-----.-----.                
|  _  ||  _  ||   _|  _  ||  _  |  _  |__ --|  -__|                
|_____||___._||____|___._||_____|___._|_____|_____|                
                                                                   
Please use our app again!
    `);
}
function updateEmployee() {}
function add(whatAdd) {}
function viewOnly(whatView) {}

openDB();
