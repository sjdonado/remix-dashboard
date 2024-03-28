export enum UserRole {
  Admin = 'ADMIN',
  Teacher = 'TEACHER',
  Student = 'STUDENT',
}
export const ALL_USER_ROLES = Object.values(UserRole) as [UserRole, ...UserRole[]];
