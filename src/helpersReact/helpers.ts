import { __DEV__ } from '../App';
import { debugOptions } from '../debugOptions';
import { Project } from '../typescript';

export const reactNavigate = (project: Project, isInIframe: boolean): void => {
  if (!debugOptions.navigateActive) {
    return;
  }

  if (project === null) {
    return;
  }

  let fullUrl: string = '';

  __DEV__ && console.log('reactNavigate', 'project', project);

  fullUrl = project.url;

  if (isInIframe) {
    window.parent.postMessage({ url: fullUrl }, '*');
  } else {
    window.location.href = fullUrl;
  }
};
