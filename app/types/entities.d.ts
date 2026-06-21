export type User = {
  id: number;
  name: string;
  password: string;
  email: string;
};

export type Item = {
  id: number;
  name: string;
  description: string;
  status: string;
  location: string;
  date_reported: string;
  date_claimed: string;
  tags: string
  image_url: string;
  user_id: string;
};
