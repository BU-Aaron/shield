export interface PageProps {
    auth?: {
      user: {
        id: number;
        name: string;
        email: string;
      };
    };
    [key: string]: any;
  }
  