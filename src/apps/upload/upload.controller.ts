import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger'
import { Public } from 'src/common/decorators/public.decorator';
import { FileUploadDto } from './dto/upload.dto';
import { MergeFileDto } from './dto/merge.dto';

@Public()
@ApiTags('文件上传')
@ApiBearerAuth()
@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post('chunk')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: '切片文件上传' })
    @ApiConsumes('multipart/form-data')
    uploadFile(@UploadedFile() file: Express.Multer.File, @Body() fileUploadDto: FileUploadDto) {

        fileUploadDto.file = file

        return this.uploadService.saveFile(fileUploadDto)
    }

    @Post('merge')
    @ApiOperation({ summary: '文件合并' })
    mergeFile(@Body() mergeFileDto: MergeFileDto) {

        return this.uploadService.mergeFile(mergeFileDto)
    }
}
