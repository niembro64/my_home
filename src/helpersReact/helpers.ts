import { ProjectName } from '../typescript';

export const reactNavigate = (project: ProjectName): void => {
  if (project === null) {
    return;
  }

  let fullUrl: string = '';

  if (project === 'Media') {
    fullUrl = 'https://' + project.toLowerCase() + '.niembro64.com/wordpress/';
  } else {
    fullUrl = 'https://' + project.toLowerCase() + '.niembro64.com';
  }
  window.open(fullUrl, '_blank');
};
