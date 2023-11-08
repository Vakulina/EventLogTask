export type EventDTO = {
  message: string;
  photoUrl: string;
  time: string;
  degree: {
    name: string;
    degree: string;
  };
  equipment?: {
    name: string;
    equipmen: string;
  };
  executor: string;
  id: string;
};
