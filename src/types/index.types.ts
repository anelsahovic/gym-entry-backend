export interface ShowMemberParams {
  memberId: string;
}

export interface ScanMemberParams {
  uniqueId: string;
}

export interface UpdateMemberParams {
  memberId: string;
}

export interface ExtendMembershipParams {
  memberId: string;
}

export interface ExtendMembershipBody {
  membershipId: string;
}

export interface DeleteMemberParams {
  memberId: string;
}

export interface ShowMembershipParams {
  membershipId: string;
}

export interface UpdateMembershipParams {
  membershipId: string;
}

export interface DeleteMembershipParams {
  membershipId: string;
}

export interface ShowUserParams {
  userId: string;
}

export interface UpdateUserParams {
  userId: string;
}

export interface DeleteUserParams {
  userId: string;
}

export interface UpdateUserPasswordParams {
  userId: string;
}
export interface ResetUserPasswordParams {
  userId: string;
}
