export const swrFetcher = async (...args: Parameters<typeof fetch>) => {
  const res = await fetch(...args);
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "An error occurred while fetching data");
  }
  return res.json();
};
