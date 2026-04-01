export const parsePagination = (
  query = {},
  defaults = { page: 1, perPage: 6 },
) => {
  const page = Math.max(1, parseInt(query.page, 10) || defaults.page);
  const perPage = Math.max(
    1,
    Math.min(100, Number(query.perPage) || defaults.perPage),
  );
  const skip = (page - 1) * perPage;
  return { page, perPage, skip };
};

export const getPaginationMeta = (totalItems, page, perPage) => {
  const totalPages = Math.ceil(totalItems / perPage);
  return {
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};
