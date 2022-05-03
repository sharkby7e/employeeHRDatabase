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

async function getManagersList() {
  let list = [];
  const results = await db.promise().execute(`
      SELECT CONCAT(first_name, ' ', last_name) AS Manager
      FROM employees WHERE manager_id IS NULL
      `);
  // err ? console.error(err) : console.log(results[0].dept_name);
  // console.log(results);
  if (!results) {
    console.error("There was an error!");
  } else {
    results[0].forEach((elem) => {
      list.push(elem.Manager);
      // console.log(list);
    });
  }
  return list;
}

async function getEmpList() {
  let list = [];
  const results = await db
    .promise()
    .execute(
      "SELECT CONCAT(first_name, ' ', last_name) AS name from employees"
    );
  // err ? console.error(err) : console.log(results[0].dept_name);
  // console.log(results);
  if (!results) {
    console.error("There was an error!");
  } else {
    results[0].forEach((elem) => {
      list.push(elem.name);
      // console.log(list);
    });
  }
  return list;
}
async function getDeptList() {
  let list = [];
  const results = await db
    .promise()
    .execute("SELECT dept_name from departments");
  // err ? console.error(err) : console.log(results[0].dept_name);
  // console.log(results);
  if (!results) {
    console.error("There was an error!");
  } else {
    results[0].forEach((elem) => {
      list.push(elem.dept_name);
      // console.log(list);
    });
  }
  return list;
}

async function getRoleList() {
  let list = [];
  const results = await db
    .promise()
    .execute("SELECT title FROM roles WHERE salary<1000");
  // err ? console.error(err) : console.log(results[0].dept_name);
  // console.log(results);
  if (!results) {
    console.error("There was an error!");
  } else {
    results[0].forEach((elem) => {
      list.push(elem.title);
      // console.log(list);
    });
  }
  return list;
}

function addDepartment() {
  inquirer
    .prompt([
      {
        message: "What is the name of this Department?",
        name: "name",
      },
    ])
    .then((answers) => {
      db.query("INSERT INTO departments (dept_name) VALUES (?)", answers.name);
      console.log(`${answers.name} Department added to database`);
      mainMenu();
    });
}

async function addRole() {
  const deptChoices = await getDeptList();
  inquirer
    .prompt([
      {
        name: "title",
        message: "What is the new role Title?",
      },
      {
        name: "salary",
        message: "What is the Salary",
      },
      {
        message: "Please select the Department",
        name: "department",
        type: "list",
        choices: deptChoices,
      },
    ])
    .then((answers) => {
      const { title, salary, department } = answers;
      let deptID = deptChoices.indexOf(department) + 1;
      db.query(
        `
        INSERT INTO roles (title, salary, department_id)
        VALUES (?,?,?)`,
        [title, salary, deptID]
      );
      console.log(`${title} added to ${department} Department`);
      mainMenu();
    });
}

async function addEmployee() {
  const managerChoices = await getManagersList();
  const roleChoices = await getRoleList();
  inquirer
    .prompt([
      {
        message: "To whom does this employee report?",
        type: "list",
        name: "manager",
        choices: managerChoices,
      },
      {
        message: "What is will be their Job Title?",
        type: "list",
        name: "role",
        choices: roleChoices,
      },
      {
        name: "first_name",
        message: "What is their First Name?",
      },
      {
        name: "last_name",
        message: "What is their Last Name?",
      },
    ])
    .then((answers) => {
      const { first_name, last_name, role, manager } = answers;
      const roleID = roleChoices.indexOf(role) + 1;
      const managerID = (managerChoices.indexOf(manager) + 1) * 9;
      db.query(
        `
        INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES (?,?,?,?)`,
        [first_name, last_name, roleID, managerID]
      );
      console.log(`New ${role}, ${first_name} ${last_name}, added to Database`);
      mainMenu();
    });
}

async function updateEmployee() {
  const empList = await getEmpList();
  const roleChoices = await getRoleList();
  inquirer
    .prompt([
      {
        message: "Which Employee would you like to update?",
        type: "list",
        choices: empList,
        name: "employee",
      },
      {
        message: "What is their new Job Title?",
        type: "list",
        choices: roleChoices,
        name: "role",
      },
    ])
    .then((answers) => {
      const { employee, role } = answers;
      const employeeID = empList.indexOf(employee) + 1;
      const roleID = roleChoices.indexOf(role) + 1;
      db.query("UPDATE employees SET role_id = ? WHERE id = ?", [
        roleID,
        employeeID,
      ]);
      console.log(`${employee} updated as new ${role}`);
      mainMenu();
    });
}

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
