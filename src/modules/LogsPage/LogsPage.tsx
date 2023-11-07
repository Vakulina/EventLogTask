import { useEffect, useRef, useState } from 'react';
import { generateDataService } from 'services/generateDataService';
import { EventType } from 'shared/types/Events';

export const LogsPage = () => {
  const [logs, setLogs] = useState<EventType[]>([]);
  const [messagesCount, setMessagesCount] = useState<number>(0);
  const timerRef = useRef<number | undefined>(undefined);
  const logsRef = useRef(logs);
  logsRef.current = logs;

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setLogs([...logsRef.current, generateDataService.generateEvent()]);
      setMessagesCount((prev) => prev + 1);
    }, 2500);

    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (messagesCount > 5) clearTimeout(timerRef.current);
  }, [messagesCount]);

  return (
    <>
      {logs.map((item) => (
        <div key={item.id}>{item.message}</div>
      ))}
    </>
  );
};
