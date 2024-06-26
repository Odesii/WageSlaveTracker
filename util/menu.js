import inquirer from "inquirer"
import {    
    viewEmp,
    viewEmpDep,
    viewByManage,
    addEmp,
    viewRole,
    updateRole,
    addRole,
    viewDep,
    addDep,
    quit,
    deleteEmp,
    deleteDep,
    viewDepBudget
    } from "./query.js"
//  sets the amin menu options 
function displayMenu() {
    const questions = [
        {
            type: 'list',
            name: 'menuOptions',
            message: 'Hello User what is your query?',
            choices: [
                'VIEW ALL EMPLOYEES',
                'VIEW EMPLOYEES BY DEPARTMENT',
                `VIEW EMPLOYEES BY MANAGER`,
                'ADD EMPLOYEE',
                'VIEW ALL ROLES',
                'UPDATE ROLES',
                'ADD ROLE',
                'VIEW ALL DEPARTMENTS',
                'VIEW DEPARTMENT BUDGET',
                'ADD DEPARTMENTS', 
                'TERMINATE DEPARTMENT',
                'TERMINATE EMPLOYEE',

                'QUIT'
            ]
        }
    ];

    return inquirer.prompt(questions);
}

//  a switch case to handle the main menu options and start query functions
function handleMenu (selection){
    switch (selection.menuOptions) {
        case 'VIEW ALL EMPLOYEES':
            viewEmp();
            break;
        
        case 'VIEW EMPLOYEES BY DEPARTMENT':
            viewEmpDep();
            break;

        case 'VIEW EMPLOYEES BY MANAGER':
            viewByManage();
            break;

        case 'ADD EMPLOYEE':
            addEmp();
            break;
        
        case 'VIEW ALL ROLES':
            viewRole();
            break;
        
        case 'UPDATE ROLES':
            updateRole();
            break;
        
        case 'ADD ROLE':
            addRole();
            break;
        
        case 'VIEW ALL DEPARTMENTS':
            viewDep();
            break;
        
        case 'ADD DEPARTMENTS':
            addDep();
            break;
        
        case 'TERMINATE DEPARTMENT':
            deleteDep();
            break;

        case 'TERMINATE EMPLOYEE':
            deleteEmp();
        break;

        case 'VIEW DEPARTMENT BUDGET':
            viewDepBudget();
            break;
            
        case 'QUIT':
            quit();
        break;
            
            default:
                console.log('BAD TOKEN. SECURITY DEPLOYED. GOODBYE USER.')
    }
}

//passes the main choice over to the switch case
function init() {
    displayMenu().then(handleMenu);
}

export { init };
