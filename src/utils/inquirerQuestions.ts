import fs from "fs";
import path from "path";

const TEMPLATE_OPTIONS = fs.readdirSync(path.join(__dirname, '..', '..', 'templates'));

const QUESTIONS = [
  {
    name: 'template',
    type: 'list',
    message: 'Which template would you like to use?',
    choices: TEMPLATE_OPTIONS
  },
  {
    name: 'projectName',
    type: 'input',
    message: 'What is the name of your project?',
    validate: (input: string) => {
      if (/^([a-z@]{1}[a-z\-\.\\\/0-9]{0,213})+$/.test(input)) return true;

      return 'Project name may only include lowercase letters, numbers, underscores and dashes, and cannot exceed 214 characters in length.';
    }
  }
];

export {QUESTIONS};