const mysql = require("mysql2");
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

// attempting to wrap in async fucntion
// async function viewOnly(whatView) {
//   const mysql = require("mysql2/promise");
//   const conn = await mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "password",
//     database: "employeeHR_db",
//   });
//   const rows = await connection.query("SELECT * FROM ?", whatView);
//   console.log(rows);
//   await conn.end();
// }
// regular floating connection
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "employeeHR_db",
  },
  console.log("connected to employeeHR_db")
);

function viewRoles() {
  db.query(
    `
    SELECT
    roles.title AS Title, 
    roles.id AS ID,
    departments.dept_name AS Department,
    roles.salary AS Salary
    FROM roles
    JOIN departments ON roles.department_id = departments.id
    `,
    (err, result) => {
      if (err) {
        console.error(err);
      } else {
        console.log("");
        console.table("Roles", result);
        mainMenu();
      }
    }
  );
}
function viewDepartments() {
  db.query("SELECT * from departments", (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log("");
      console.table("Departments", result);
      mainMenu();
    }
  });
}
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
          viewDepartments();
          break;
        case "View all roles":
          viewRoles("roles");
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
  db.end();
}
function updateEmployee() {}
function add(whatAdd) {}
function viewOnly(whatView) {}

openDB();
