import { Project } from '../typescript';
export const projects: Project[] = [
  {
    fileName: 'Design',
    colorScheme: 'light',
    type: 'Front-End',
    stack: ['CSS', 'HTML', 'JavaScript'],
    url: 'http://design.niemo.io/',
  },
  {
    fileName: 'Smashed',
    colorScheme: 'dark',
    type: 'Game',
    stack: [
      'Phaser',
      'React',
      'TypeScript',
      'MongoDB',
      'Node.js',
      'Express.js',
    ],
    url: 'http://smashed.niemo.io/',
  },
  {
    fileName: 'Pirates',
    colorScheme: 'light',
    type: 'Full-Stack',
    stack: ['React', 'TypeScript', 'MongoDB', 'Node.js', 'Express.js'],
    url: 'http://pirates.niemo.io/',
  },
  // {
  //   title: 'Events',
  //   colorScheme: 'light',
  //   type: 'MVC',
  //   stack: ['C#', 'ASP.NET', 'MySQL'],
  //   url: 'http://events.niemo.io/',
  // },
  // {
  //   title: 'Shows',
  //   colorScheme: 'light',
  //   type: 'MVC',
  //   stack: ['Python', 'Flask', 'MySQL'],
  //   url: 'http://shows.niemo.io/',
  // },
  {
    fileName: 'Media',
    colorScheme: 'dark',
    type: 'Art',
    stack: ['FL Studio', 'Aseprite', 'Adobe Creative Suite', 'WordPress'],
    url: 'https://soundcloud.com/niemoaudio/ars-niemo-small-talk-build-iv',
  },
];
