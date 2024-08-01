import { BadRequestException } from "@nestjs/common";
import * as fs from "fs-extra";
import * as path from "path"

export const uploadImage = async (file: Express.Multer.File, fulPath: string, dirPath: string) => {
    try {
        const uploadPath = path.join(process.cwd(), `images/${dirPath}`);
        fs.ensureDir(uploadPath);
        const filename: string = fulPath.split('/').pop();
        
        const absolutePath = path.join(uploadPath, filename);
        console.log('image was uploaded ::', absolutePath);
        
        await fs.writeFile(absolutePath, file.buffer);
    } catch (error) {
        throw new BadRequestException('Failed to save image');
    }
}

export const deleteImage = async (delFilePath: string) => {
    try {

        const delFullPath:string = path.resolve(delFilePath);
        await fs.unlink(delFullPath);
  
        console.log('image was deleted ::', delFullPath);
        return true;
  
    } catch(error) {
  
        console.log(error);
        return false;
  
    }
}