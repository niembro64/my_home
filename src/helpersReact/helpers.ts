import { __DEV__ } from '../App';
import { debugOptions } from '../debugOptions';
import { Project } from '../typescript';

export const reactNavigate = (project: Project): void => {
  if (!debugOptions.navigateActive) {
    return;
  }

  if (project === null) {
    return;
  }

  let fullUrl: string = '';

  __DEV__ && console.log('reactNavigate', 'project', project);

  fullUrl = project.url;

  window.location.href = fullUrl;
};
