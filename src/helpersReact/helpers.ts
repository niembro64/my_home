import { debugOptions } from '../debugOptions';
import { ProjectName } from '../typescript';

export const reactNavigate = (project: ProjectName): void => {
  if (!debugOptions.navigateActive) {
    return;
  }

  if (project === null) {
    return;
  }

  let fullUrl: string = '';

  console.log('reactNavigate', 'project', project);
  if (project === 'Resume') {
    fullUrl = 'https://www.ericniemeyer.com';
  } else if (project === 'Media') {
    fullUrl = 'https://media.niembro64.com/wordpress/';
  } else {
    fullUrl = 'https://' + project.toLowerCase() + '.niembro64.com';
  }
  window.open(fullUrl, '_blank');
};
