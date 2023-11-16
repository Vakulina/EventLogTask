import { Dispatch, SetStateAction, createContext } from 'react';
import { EventType } from 'shared/types/Events';

interface DataViewCardsContextType {
  setSelectedLog: Dispatch<SetStateAction<EventType | null>> | null;
  selectedLog: EventType | null;
}

export const DataViewCardsContext = createContext<DataViewCardsContextType>({
  setSelectedLog: null,
  selectedLog: null,
});
