import { Storage } from '@ionic/storage';

const storage = new Storage();

export const initStorage = async () => {
    await storage.create();
}

export default storage;