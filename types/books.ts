export interface Book {
  _id?: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  quantity: number;
  cover?: string;
}

export interface AddBookRequest {
  title: string;
  author: string;
  isbn: string;
  category: string;
  quantity: number;
  cover?: string;
}

export interface Issuance {
  _id?: string;
  bookId: string;
  userId: string;
  issueDate: string;
  returnDate?: string;
}



export interface IssueBookRequest {
  bookId: string;
  userId: string;
  issueDate: string;
  returnDate?: string;
}

export interface BookResponse {
  success: boolean;
  book: Book;
}

export interface IssuanceResponse {
  success: boolean;
  issuance: Issuance;
}