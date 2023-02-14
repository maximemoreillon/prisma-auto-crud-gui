export const updateQuery = (route, router, newItem) => {
  const query = { ...route.query, ...newItem };
  // Preventing route duplicates
  if (JSON.stringify(route.query) !== JSON.stringify(query))
    router.push({ query });
};
