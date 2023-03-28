import { Data, render } from 'ejs';

function renderTemplate(template: string, data: Data) {
  return render(template, data);
}

export { renderTemplate };