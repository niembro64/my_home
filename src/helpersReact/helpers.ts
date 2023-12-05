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
  if (project === 'Media' || project === 'Events' || project === 'Shows') {
    fullUrl = 'https://niemo.io';
  } else {
    fullUrl = 'https://' + project.toLowerCase() + '.niemo.io';
  }
  // window.open(fullUrl, '_blank');
  window.location.href = fullUrl;
};
