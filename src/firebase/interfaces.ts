export interface NewsData {
  id: string;
  date: Date;
  title: string;
  content: string;
  imageUrl: string;
  views: number;
  editedDate?: Date;
}

export interface AboutData {
  id: string;
  content: string;
}
