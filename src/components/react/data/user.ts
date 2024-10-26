export const fetchAuthUser = async () => {
  const f = await fetch("/api/user/get", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await f.json();
};
