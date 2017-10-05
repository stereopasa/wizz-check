import { Db, MongoClient } from 'mongodb'

export class MongoService {
    private static connectionInstance: Db;
    private constructor() { }

    private static init(): Promise<Db> {
        let uri = process.env.MLAB_URI || process.env.MONGO_ATLAS_URI;

        return new Promise<Db>((resolve, reject) => {
            MongoClient.connect(uri, (err, db) => {
                if (err)
                    reject(err);

                MongoService.connectionInstance = db;
                resolve(db);
            })
        });
    }

    static getInstance(): Promise<Db> {
        if (!this.connectionInstance) {
            return this.init()
        }
        return Promise.resolve(this.connectionInstance);
    }

    static shutdown() {
        if (this.connectionInstance) {
            this.connectionInstance.close();
            this.connectionInstance = null;
        }
    }
}