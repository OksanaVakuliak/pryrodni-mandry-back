import User from '../models/user.js';
import * as travellersService from '../services/travellerService.js';
import createHttpError from 'http-errors';

export const getTravellers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const travellers = await User.aggregate([
      {
        $lookup: {
          from: 'stories',
          localField: '_id',
          foreignField: 'ownerId',
          as: 'userArticles',
        },
      },
      {
        $addFields: {
          storiesCount: { $size: '$userArticles' },
        },
      },
      {
        $match: {
          articlesAmount: { $gt: 0 },
        },
      },
      { $sort: { articlesAmount: -1 } },
      {
        $facet: {
          metadata: [{ $count: 'totalItems' }],
          data: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                password: 0,
                email: 0,
                userArticles: 0,
                updatedAt: 0,
                createdAt: 0,
                __v: 0,
              },
            },
          ],
        },
      },
    ]);

    const result = travellers[0];
    const items = result?.data || [];
    const totalItems = result?.metadata[0]?.totalItems || 0;
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      status: 200,
      data: {
        travellers: items,
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// otrymaty profil
export const getTravellerProfile = async (req, res, next) => {
  const { id } = req.params;
  const traveller = await travellersService.getTravellerProfile(id);
  if (!traveller) {
    return next(createHttpError(404, 'Traveller not found'));
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found traveller profile!',
    data: traveller,
  });
};

// otrymaty istorii avtora
export const getTravellerStories = async (req, res, next) => {
  const { id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;

  const result = await travellersService.getTravellerStories({
    ownerId: id,
    page,
    limit,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found traveller stories!',
    data: result,
  });
};
