import http from "../utils/http";
export const getAdminReport = async () => {
  const res = await http.get("/admin/report"); 
  return res.data;
};
export const getAllBooksAdmin = async () => {
  const res = await http.get("/admin/books"); 
  return res.data;
};
export const getAllUsersAdmin = async () => {
  const res = await http.get("/admin/users"); 
  return res.data;
};
export const getAllBorrowsAdmin = async () => {
  const res = await http.get("/admin/borrows"); 
  return res.data;
};
export const deleteUserAdmin = async (id: string) => {
  const res = await http.delete(`/admin/delete-user/${id}`);
  return res.data;
};
export const deleteBook = async (id: string) => {
  const res = await http.delete(`/book/delete/${id}`); 
  return res.data;
};
