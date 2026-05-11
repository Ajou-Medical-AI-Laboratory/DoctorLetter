import { apiFetch } from './client';

export interface MemberCreateRequest {
  userId: string;
  password: string;
  age: number;
  sex: string;
  name: string;
}

export interface MemberCreateResponse {
  userId: string;
}

export interface FindMemberResponse {
  userId: string;
  name: string;
  age: number;
  sex: string;
  specificity_disease: string | null;
}

export interface MemberUpdateRequest {
  password: string;
  specificity_disease?: string;
  new_password?: string;
}

export interface MemberUpdateResponse {
  userId: string;
  specificity_disease: string | null;
}

export interface MemberDeleteRequest {
  password: string;
}

export interface MemberDeleteResponse {
  message: string;
}

export function signUpApi(req: MemberCreateRequest): Promise<MemberCreateResponse> {
  return apiFetch<MemberCreateResponse>('/create', {
    method: 'POST',
    body: JSON.stringify(req),
  });
}

export function getMeApi(): Promise<FindMemberResponse> {
  return apiFetch<FindMemberResponse>('/me');
}

export function updateMemberApi(req: MemberUpdateRequest): Promise<MemberUpdateResponse> {
  return apiFetch<MemberUpdateResponse>('/update', {
    method: 'PATCH',
    body: JSON.stringify(req),
  });
}

export function deleteMemberApi(req: MemberDeleteRequest): Promise<MemberDeleteResponse> {
  return apiFetch<MemberDeleteResponse>('/delete', {
    method: 'DELETE',
    body: JSON.stringify(req),
  });
}
