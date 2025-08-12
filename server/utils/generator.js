exports.generateOrderNum = async (session) => {
  const today = new Date();
  const yyyymmdd = today
    .toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })
    .replace(/\./g, "")
    .replace(/\s/g, "");

  const orderNum = yyyymmdd + generateRandomString();
  return orderNum;
};

const generateRandomString = () => {
  const randomString = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 36).toString(36)
  ).join("");
  return randomString;
};
