import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt, IsString } from "class-validator";
import { defaultIntOptions } from "src/common/validator/int";
import { defaultStringOptions } from "src/common/validator/string";

export class FileUploadDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: Express.Multer.File

    @IsString(defaultStringOptions)
    fileName: string

    @Transform(({ value }) => parseInt(value))
    @IsInt(defaultIntOptions)
    index: number
}
