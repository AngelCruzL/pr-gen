#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import shell from 'shelljs';
import chalk from 'chalk';

import { renderTemplate } from './utils/renderTemplate';
import {QUESTIONS} from "./utils/inquirerQuestions";

const CURRENT_PROJECT_PATH = process.cwd();

inquirer.prompt(QUESTIONS).then(answers => {
  const { template, projectName } = answers;
  const templatePath = path.join(__dirname, '..', 'templates', template);
  const projectPath = path.join(CURRENT_PROJECT_PATH, projectName);

  createProject(projectPath, projectName);
  createDirectory(templatePath, projectName);
  postProcess(templatePath, projectPath, projectName);
});

function createProject(projectPath: fs.PathLike, projectName: string) {
  if (fs.existsSync(projectPath)) {
    console.log(chalk.red(`${projectName} already exists`));
    process.exit(1);
  }

  fs.mkdirSync(projectPath);
}

function createDirectory(templatePath: any, projectName: string) {
  const listFileDirectories = fs.readdirSync(templatePath);

  listFileDirectories.forEach(file => {
    const filePath = path.join(templatePath, file);
    const stats = fs.statSync(filePath);
    const writePath = path.join(CURRENT_PROJECT_PATH, projectName, file);

    if (stats.isFile()) {
      let contents = fs.readFileSync(filePath, 'utf-8');
      contents = renderTemplate(contents, { projectName });
      fs.writeFileSync(writePath, contents, 'utf-8');

      const CREATE = chalk.green('CREATE ');
      const size = stats['size'];
      console.log(`${CREATE} ${filePath} (${size} bytes)`);
    } else if (stats.isDirectory()) {
      fs.mkdirSync(writePath);
      createDirectory(
        path.join(templatePath, file),
        path.join(projectName, file)
      );
    }
  });
}

function postProcess(templatePath: any, projectPath: string, projectName: string) {
  const isNode = fs.existsSync(path.join(templatePath, 'package.json'));

  if (isNode) {
    shell.cd(projectPath);
    console.log(chalk.green(`Installing dependencies for ${projectName}`));
    const result = shell.exec('npm install');
    if (result.code != 0) return false;
  }
}
