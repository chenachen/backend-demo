import { Injectable } from '@nestjs/common';
import { FileUploadDto } from './dto/upload.dto';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config';
import { IUploadConfig, UPLOAD_CONFIG_TOKEN } from 'src/config/upload.config';
import { join, resolve } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { generateUUID } from 'src/common/utils/tools';
import { ResponseModel } from 'src/common/models/response.model';
import { LoggerService } from 'src/shared/logger/logger.service';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { ErrorEnum } from 'src/constant/response-code.constant';
import { randomBytes } from 'crypto';
import { MergeFileDto } from './dto/merge.dto';

@Injectable()
export class UploadService {

    private uploadTempDir: string;
    private uploadTargetDir: string;

    constructor (
        private readonly configService: ConfigService<AllConfigType>,
        private readonly loggerService: LoggerService
    ) {
        const {dir} = this.configService.get<IUploadConfig>(UPLOAD_CONFIG_TOKEN)
        this.uploadTempDir = resolve(dir, './temp')
        this.uploadTargetDir = resolve(dir, './files')
    }

    async saveFile(fileUploadDto: FileUploadDto) {

        const {file, id, index} = fileUploadDto
        const tempPath = resolve(this.uploadTempDir, id)

        if (!existsSync(tempPath)) {
            mkdirSync(tempPath, {recursive: true})
        }

        try {
            const randomFileName = `${randomBytes(16).toString('hex')}-${index}`
            const filePath = join(tempPath, randomFileName)
            console.log(filePath)

            writeFileSync(filePath, file.buffer)

            return ResponseModel.success({message: '文件上传成功'})
        } catch (err) {
            this.loggerService.error(err.message, err.stack, UploadService.name)

            throw new BusinessException(ErrorEnum.UPLOAD_FILE_FAIL)
        }

    }

    async mergeFile(mergeFileDto: MergeFileDto) {
        throw new Error('Method not implemented.');
    }

}
