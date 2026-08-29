export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  summary: string;
  content: string;
  bookTitle?: string;
  bookAuthor?: string;
  rating?: number;
  cover?: string;
  isbn?: string;
};
