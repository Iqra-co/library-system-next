import http from "../utils/httpClient";

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

export const requestOnline = async (bookId: string) => {
  const res = await http.post("/borrow/request-online", { bookId });
  return res.data;
};

export const getPendingRequests = async () => {
  const res = await http.get("/borrow/pending-requests");
  return res.data;
};

export const approveOnline = async (borrowId: string, assignedTo?: string) => {
  const res = await http.post("/borrow/approve-online", { borrowId, assignedTo });
  return res.data;
};

export const getBorrowById = async (id: string) => {
  const res = await http.get(`/borrow/${id}`);
  return res.data;
};
