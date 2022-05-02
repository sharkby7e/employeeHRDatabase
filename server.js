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

function viewEmployees() {
  db.query(
    `
    SELECT
      CONCAT(e.first_name, ' ', e.last_name) AS Name, 
      e.id AS ID,
      roles.title AS Title,
      roles.salary AS Salary,
      departments.dept_name AS Department,
      CONCAT(m.first_name, ' ', m.last_name) AS Manager
    FROM employees e
      LEFT JOIN employees m 
        ON m.id = e.manager_id
      JOIN roles 
        ON e.role_id = roles.id
      JOIN departments 
        ON roles.department_id = departments.id
    `,
    (err, result) => {
      if (err) {
        console.error(err);
      } else {
        console.log("");
        console.table("Employees", result);
        mainMenu();
      }
    }
  );
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
          viewEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
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

openDB();
