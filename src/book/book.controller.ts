import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BookController {
    constructor(private bookService: BookService) {}

    @Get()
    async getAllBooks(): Promise<Book[]> {
        return this.bookService.findAll();
    }

    @Post()
    async createBook(@Body() book: CreateBookDto): Promise<Book>{
        return this.bookService.create(book);
    }

    @Get(':id')
    async getBook(
        @Param('id')
        id: string
    ): Promise<Book>{
        const book = await this.bookService.findById(id);
        if(!book){
            throw new NotFoundException('Book not found')
        }
        return book
    }

    @Put(':id')
    async updateBook(
        @Param('id')
        id: string,
        @Body()
        body: UpdateBookDto
    ): Promise<Book>{
        return this.bookService.updateById(id,body)
    }
    
    @Delete(':id')
    async deleteBook(
        @Param('id')
        id: string,
    ): Promise<Book> {
        return this.bookService.deleteById(id)
    }

}
