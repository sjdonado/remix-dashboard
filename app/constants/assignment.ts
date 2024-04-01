import { faker } from '@faker-js/faker';

export enum AssignmentStatus {
  Open = 'OPEN',
  Closed = 'CLOSED',
}

export const ALL_ASSIGNMENT_STATUSES = Object.values(AssignmentStatus) as [
  AssignmentStatus,
  ...AssignmentStatus[]
];

export enum AssignmentType {
  Homework = 'HOMEWORK',
  Quiz = 'QUIZ',
  Project = 'PROJECT',
}

export const ALL_ASSIGNMENT_TYPES = Object.values(AssignmentType) as [
  AssignmentType,
  ...AssignmentType[]
];

const assignmentBase = () => ({
  content: faker.lorem.paragraphs(4, '\n'),
  points: faker.number.int({ min: 1, max: 10 }),
  dueAt: faker.date.future(),
});

export const MOCKED_ASSIGNMENT_BY_TYPE = {
  [AssignmentType.Homework]: {
    ...assignmentBase(),
    title: 'Homework Example',
  },
  [AssignmentType.Quiz]: {
    ...assignmentBase(),
    title: 'Quiz Example',
  },
  [AssignmentType.Project]: {
    ...assignmentBase(),
    title: 'Project Example',
  },
};
