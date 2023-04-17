import { __DEV__ } from '../App';
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

  __DEV__ && console.log('reactNavigate', 'project', project);
  if (project === 'Resume') {
    fullUrl = 'https://ericniemeyer.com';
  } else if (project === 'Media') {
    fullUrl = 'https://media.niembro64.com/wordpress/';
  } else {
    fullUrl = 'https://' + project.toLowerCase() + '.niembro64.com';
  }
  // window.open(fullUrl, '_blank');
  window.location.href = fullUrl;
};
