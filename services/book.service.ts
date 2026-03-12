import http from "../utils/http";
import { Book, AddBookRequest, BookResponse, Issuance, IssuanceResponse, IssueBookRequest } from "../types/books";

export async function addBook(payload: FormData): Promise<BookResponse> {
  const res = await http.post("/book/add-book", payload);
  return res.data;
}
export async function getAllBooks(): Promise<{ success: boolean; data: Book[] }> {
  const res = await http.get("/book/getAllBooks");
  return res.data;
}

export async function deleteBook(id: string): Promise<{ success: boolean; message: string }> {
  const res = await http.delete(`/book/delete/${id}`);
  return res.data;
}

export async function getMyBorrowedBooks(): Promise<{ success: boolean; issuances: Issuance[] }> {
  const res = await http.get("/borrow/my"); 
  return res.data;
}
export async function searchBooks(query: string): Promise<{ success: boolean; books: Book[] }> {
    const res = await http.get(`/book/search?title=${query}`); 
    return res.data;
}

export const getSingleBook = async (id: string) => {
  const res = await http.get(`/book/getSingleBook/${id}`); 
  return res.data;
};
export const updateBook = async (id: string, formData: any) => {
  const res = await http.put(`/book/updateBook/${id}`, formData); 
  return res.data;
};
