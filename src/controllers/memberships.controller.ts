import { RequestHandler } from 'express';
import {
  createMembership,
  deleteMembership,
  getMembershipById,
  getMemberships,
  updateMembership,
} from '../services/memberships.service';
import createHttpError from 'http-errors';
import {
  DeleteMembershipParams,
  ShowMembershipParams,
  UpdateMembershipParams,
} from '../types/index.types';
import {
  CreateMembershipBody,
  UpdateMembershipBody,
} from '../zodSchemas/schemas';

export const index: RequestHandler = async (req, res, next) => {
  try {
    const memberships = await getMemberships();

    if (!memberships || !memberships.length)
      throw createHttpError(404, 'No memberships found.');

    res.status(200).json(memberships);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const show: RequestHandler<
  ShowMembershipParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { membershipId } = req.params;

  try {
    if (!membershipId)
      throw createHttpError(400, 'Please provide membership ID.');

    const membership = await getMembershipById(membershipId);

    if (!membership) throw createHttpError(404, 'No membership found.');

    res.status(200).json(membership);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const store: RequestHandler<
  unknown,
  unknown,
  CreateMembershipBody,
  unknown
> = async (req, res, next) => {
  const { name, durationDays, price } = req.body;
  try {
    const membershipData = { name, durationDays, price };

    const membership = await createMembership(membershipData);

    res.status(201).json(membership);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const update: RequestHandler<
  UpdateMembershipParams,
  unknown,
  UpdateMembershipBody,
  unknown
> = async (req, res, next) => {
  const { membershipId } = req.params;
  const { name, durationDays, price } = req.body;

  try {
    if (!membershipId)
      throw createHttpError(400, 'Please provide membership ID.');

    const updatedMembershipData = { name, durationDays, price };

    const updatedMembership = await updateMembership(
      membershipId,
      updatedMembershipData
    );

    res.status(200).json(updatedMembership);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const destroy: RequestHandler<
  DeleteMembershipParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { membershipId } = req.params;

  try {
    if (!membershipId)
      throw createHttpError(400, 'Please provide membership ID.');

    await deleteMembership(membershipId);

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
