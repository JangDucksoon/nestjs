import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Query, UseGuards, SetMetadata, Request } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { deleteImage, uploadImage } from 'src/utils/fileUtil';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) { }

	@Post()
	@UseInterceptors(FileInterceptor('file'))
	@SetMetadata('auth', 'sys')
	@UseGuards(JwtAuthGuard)
	async create(@Body() createProductDto: CreateProductDto, @UploadedFile() file: Express.Multer.File, @Request() req: any) {
		if (file) {
			if (createProductDto.image_url) {
				await uploadImage(file, createProductDto.image_url, 'products');
			} else {
				throw new BadRequestException('Faild to upload image');
			}
		}

		return this.productService.create(createProductDto);
	}

	@Get()
	findAll(@Query() query: any, @Request() req: any) {
		return this.productService.findAll(query);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.productService.findOne(+id);
	}

	@Patch(':id')
	@UseInterceptors(FileInterceptor('file'))
	@SetMetadata('auth', ['sys'])
	@UseGuards(JwtAuthGuard)
	async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @UploadedFile() file: Express.Multer.File) {

		if (file) {
			const image_url = await this.productService.findPreImage(+id);	//기존에 등록된 image_url 찾기

			if (image_url) {
				const deleteYn: boolean = await deleteImage(image_url.image_url);	//등록된 이미지 삭제 error 시 false 리턴
				if (deleteYn) {
					await uploadImage(file, updateProductDto.image_url, 'products');	//이미지 업로드
				} else {
					throw new BadRequestException('failed to remove file');
				}
			}
		}

		return this.productService.update(+id, updateProductDto);
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	@SetMetadata('auth', ['sys'])
	async remove(@Param('id') id: string) {
		try {
			const product = await this.productService.findPreImage(+id);	//기존에 등록된 image_url 찾기
			if (product) {
				const deleteYn: boolean = await deleteImage(product.image_url);
				if (!deleteYn) {
					throw new BadRequestException('Failed to delete file');
				}
			}

			return this.productService.remove(+id);
		} catch (error) {
			throw new BadRequestException('Failed to remove');
		}
	}
}
