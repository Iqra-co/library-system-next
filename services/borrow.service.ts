import http from "../utils/http";

export const getMyBorrowedBooks = async () => {
  const res = await http.get("/borrow/my");
  return res.data;
};
export const returnBook = async (borrowId: string) => {
  const res = await http.put(`/borrow/return/${borrowId}`);
  return res.data;
};
export const issueBook = async (bookId: string, userId: string) => {
  const res = await http.post("/borrow/issue", { bookId, userId });
  return res.data;
};
