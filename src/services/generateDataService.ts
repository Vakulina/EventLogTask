import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

class GenerateDataService {
  private messageList = [
    'Сервер Vegas не доступен',
    'Потеряно сетевое соединение',
    'Открыта крышка',
    'Низкий заряд батареи',
    'Недостаточное количество масла',
    'Обрыв силового кабеля',
    'Отсутствует подтверждение пуска в работу',
  ];

  private degreeList = [
    {
      name: 'Низкая',
      degree: 'low',
    },
    {
      name: 'Высокая',
      degree: 'high',
    },
    {
      name: 'Критическая',
      degree: 'critical',
    },
  ];
  private equipmentList = [
    { name: 'Вегас', equipmen: 'vegas' },
    { name: 'Коммутатор', equipmen: 'equipmen:' },
    { name: 'Люк', equipmen: 'hatch' },
    { name: 'ИБП', equipmen: 'UPS' },
    { name: 'Трансформатор', equipmen: 'Transformer' },
    { name: 'ЛВС', equipmen: 'LVS' },
    { name: '', equipmen: '' },
  ];
  private executorList = [
    'Смирнов В.А.',
    'Капустин С.C.',
    'Ветрова И.С.',
    'Лавочкин А.В.',
    'Ольшанская Е.Г.',
  ];

  getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  generateEvent = () => {
    const id = uuidv4();
    const message =
      this.messageList[this.getRandomNumber(0, this.messageList.length - 1)];
    const photoUrl = faker.internet.avatar();
    const degree =
      this.degreeList[this.getRandomNumber(0, this.degreeList.length - 1)];
    const equipment =
      this.equipmentList[
        this.getRandomNumber(0, this.equipmentList.length - 1)
      ];
    const executor =
      this.executorList[this.getRandomNumber(0, this.executorList.length - 1)];
    const time = new Date().toLocaleTimeString();

    return {
      id,
      message,
      photoUrl,
      degree,
      equipment,
      executor,
      time,
    };
  };
}

export const generateDataService = new GenerateDataService();
