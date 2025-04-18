export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export const onlyAdmin = [Role.ADMIN];
export const onlyUser = [Role.USER];
export const allUser = [Role.ADMIN, Role.USER];
