const mysql = require("mysql2");
const inquirer = require("inquirer");
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

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password", // put your password here
    database: "employeeHR_db",
  },
  console.log("connected to employeeHR_db")
);

// shows all departments
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

// shows all roles
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

//shows employee chart joined with role, salary, and to itself with a subTable
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

// first prompt for user
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
      console.log(answers.choice);
      switch (answers.choice) {
        case "View all departments":
          viewDepartments();
          break;
        case "View all roles":
          viewRoles();
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

// returns array of all managers
async function getManagersList() {
  let list = [];
  const results = await db.promise().execute(`
      SELECT CONCAT(first_name, ' ', last_name) AS Manager
      FROM employees WHERE manager_id IS NULL
      `);
  if (!results) {
    console.error("There was an error!");
  } else {
    results[0].forEach((elem) => {
      list.push(elem.Manager);
    });
  }
  return list;
}

// returns array of all employees
async function getEmpList() {
  let list = [];
  const results = await db.promise().execute(`
    SELECT CONCAT(first_name, ' ', last_name) AS Name 
    FROM employees
    `);
  if (!results) {
    console.error("There was an error!");
  } else {
    results[0].forEach((elem) => {
      list.push(elem.Name);
    });
  }
  return list;
}

// returns array of all departments
async function getDeptList() {
  let list = [];
  const results = await db
    .promise()
    .execute("SELECT dept_name from departments");
  if (!results) {
    console.error("There was an error!");
  } else {
    results[0].forEach((elem) => {
      list.push(elem.dept_name);
    });
  }
  return list;
}

// returns array of all roles
async function getRoleList() {
  let list = [];
  const results = await db
    .promise()
    .execute("SELECT title FROM roles WHERE salary<1000");
  if (!results) {
    console.error("There was an error!");
  } else {
    results[0].forEach((elem) => {
      list.push(elem.title);
    });
  }
  return list;
}

// add a department prompt and insert into database
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

// add a role prompt and insert into db
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

// add employee prompt and inserst into db
async function addEmployee() {
  console.log("running");
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

// updates employee in db
async function updateEmployee() {
  const empList = await getEmpList();
  const roleList = await getRoleList();
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
        choices: roleList,
        name: "role",
      },
    ])
    .then((answers) => {
      const { employee, role } = answers;
      const employeeID = empList.indexOf(employee) + 1;
      const roleID = roleList.indexOf(role) + 1;
      db.query(`UPDATE employees SET role_id = ? WHERE id = ?`, [
        roleID,
        employeeID,
      ]);
      console.log(`${employee} updated as new ${role}`);
      mainMenu();
    });
}

// final screen on exit
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

openDB();
