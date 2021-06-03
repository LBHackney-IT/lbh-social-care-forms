import { Resident, User } from '../types';

export const canUserEditPerson = (
  user: User,
  person: Pick<Resident, 'restricted' | 'contextFlag'>
): boolean => {
  const isPersonRestricted = person.restricted === 'Y';

  if (user.hasAdminPermissions || user.hasDevPermissions) {
    if (isPersonRestricted) {
      return user.hasUnrestrictedPermissions || false;
    }

    return true;
  }

  if (user.hasChildrenPermissions && person.contextFlag === 'C') {
    if (isPersonRestricted) {
      return user.hasUnrestrictedPermissions || false;
    }
    return true;
  }

  if (user.hasAdultPermissions && person.contextFlag === 'A') {
    if (isPersonRestricted) {
      return user.hasUnrestrictedPermissions || false;
    }

    return true;
  }

  return false;
};

export const canManageCases = (
  user: User,
  person: Pick<Resident, 'restricted' | 'contextFlag'>
): boolean => {
  const isPersonRestricted = person.restricted === 'Y';

  if (user.hasAdminPermissions || user.hasDevPermissions) {
    if (isPersonRestricted) {
      return user.hasUnrestrictedPermissions || false;
    }

    return true;
  }

  if (user.hasChildrenPermissions && person.contextFlag === 'C') {
    if (isPersonRestricted) {
      return user.hasUnrestrictedPermissions || false;
    }

    return true;
  }

  if (user.hasAdultPermissions && person.contextFlag === 'A') {
    if (isPersonRestricted) {
      return user.hasUnrestrictedPermissions || false;
    }

    return true;
  }

  return false;
};

export const canViewArea = (user: User) => {
  if (user.hasDevPermissions) {
    return true;
  }

  return false;
};
export const canViewRelationships = (user: User, resident: Resident) => {
  if (user.hasDevPermissions) {
    return true;
  }
  if (user.hasAdultPermissions && resident.contextFlag === 'A') {
    return true;
  }

  return false;
};
