export function getAdminSort(query, defaultSort = { createdAt: -1 }) {
  switch (query.sort) {
    case "oldest":
      return { createdAt: 1 };
    case "order":
      return { sortOrder: 1, createdAt: -1 };
    case "latest":
      return { createdAt: -1 };
    default:
      return defaultSort;
  }
}
