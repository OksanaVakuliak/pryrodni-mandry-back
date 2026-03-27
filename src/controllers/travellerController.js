import User from '../models/user.js';

export const getTravellers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const travellers = await User.aggregate([
      {
        $lookup: {
          from: 'articless',
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
