import { RequestHandler } from 'express';
import {
  createMember,
  deleteMember,
  extendMembership,
  getMemberById,
  getMemberByUniqueId,
  getMembers,
  updateMember,
} from '../services/members.service';
import createHttpError from 'http-errors';
import {
  DeleteMemberParams,
  ExtendMembershipBody,
  ExtendMembershipParams,
  ScanMemberParams,
  ShowMemberParams,
  UpdateMemberParams,
} from '../types/index.types';
import { CreateMemberBody, UpdateMemberBody } from '../zodSchemas/schemas';

export const index: RequestHandler = async (req, res, next) => {
  try {
    const members = await getMembers();

    if (!members || !members.length)
      throw createHttpError(404, 'No members found.');

    res.status(200).json(members);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const show: RequestHandler<
  ShowMemberParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { memberId } = req.params;
  try {
    if (!memberId) throw createHttpError(400, 'Please enter member id.');

    const member = await getMemberById(memberId);

    if (!member) throw createHttpError(404, 'No member found.');

    res.status(200).json(member);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const scan: RequestHandler<
  ScanMemberParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { uniqueId } = req.params;
  try {
    if (!uniqueId) throw createHttpError(400, 'Please enter member id.');

    const member = await getMemberByUniqueId(uniqueId);

    if (!member) throw createHttpError(404, 'No member found.');

    res.status(200).json(member);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const store: RequestHandler<
  unknown,
  unknown,
  CreateMemberBody,
  unknown
> = async (req, res, next) => {
  const {
    name,
    email,
    phone,
    dateOfBirth,
    uniqueId,
    startDate,
    membershipId,
    staffId,
  } = req.body;

  try {
    const newMemberData = {
      name,
      email,
      phone,
      dateOfBirth,
      uniqueId,
      startDate,
      membershipId,
      staffId,
    };

    const newMember = await createMember(newMemberData);

    res.status(201).json(newMember);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const update: RequestHandler<
  UpdateMemberParams,
  unknown,
  UpdateMemberBody,
  unknown
> = async (req, res, next) => {
  const { memberId } = req.params;
  const { name, email, phone, dateOfBirth, uniqueId } = req.body;

  try {
    if (!memberId)
      throw createHttpError(400, 'Please select member to update.');

    const updateMemberData = { name, email, phone, dateOfBirth, uniqueId };

    const updatedMember = await updateMember(memberId, updateMemberData);

    res.status(200).json(updatedMember);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const extend: RequestHandler<
  ExtendMembershipParams,
  unknown,
  ExtendMembershipBody,
  unknown
> = async (req, res, next) => {
  const { memberId } = req.params;
  const { membershipId } = req.body;

  try {
    if (!memberId) throw createHttpError(400, 'Please provide member ID.');
    if (!membershipId)
      throw createHttpError(400, 'Please provide membership ID.');

    const member = await extendMembership(memberId, membershipId);

    res.status(200).json(member);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const destroy: RequestHandler<
  DeleteMemberParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { memberId } = req.params;

  try {
    if (!memberId) throw createHttpError(400, 'Please provide member Id.');

    await deleteMember(memberId);

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
