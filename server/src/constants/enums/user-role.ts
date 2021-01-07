export enum UserRole {
  Everyone = 1,
  Subadmin = 2,
  Admin = 3,
  Superadmin = 4,
}

export const AllUserRoles = [
  UserRole.Everyone,
  UserRole.Subadmin,
  UserRole.Admin,
  UserRole.Superadmin,
];
