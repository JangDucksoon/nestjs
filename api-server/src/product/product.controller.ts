import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { deleteImage, uploadImage } from 'src/utils/fileUtil';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) { }

	@Post()
	create(@Body() createProductDto: CreateProductDto) {
		return this.productService.create(createProductDto);
	}

	@Get()
	findAll(@Query() query: any) {
		return this.productService.findAll(query);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.productService.findOne(+id);
	}

	@Patch(':id')
	@UseInterceptors(FileInterceptor('file'))
	async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @UploadedFile() file: Express.Multer.File) {

		if (file) {
			const image_url = await this.productService.findPreImage(+id);

			if (image_url) {
				const deleteYn: boolean = await deleteImage(image_url.image_url);
				if (deleteYn) {
					await uploadImage(file, updateProductDto.image_url, 'products');
				} else {
					throw new BadRequestException('failed to remove file');
				}
			}
		}

		return this.productService.update(+id, updateProductDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.productService.remove(+id);
	}
}
