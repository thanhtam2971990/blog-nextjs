import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

export const storageConfig = (folder: string) =>
    diskStorage({
        destination: (req, file, cb) => {
            const dir = `./uploads/${folder}`;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            const ext = extname(file.originalname);
            const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
            cb(null, fileName);
        },
    });
