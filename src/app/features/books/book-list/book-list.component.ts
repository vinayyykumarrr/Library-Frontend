
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../core/models/book';


@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],

  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent {
  q = '';
  books = signal<Book[]>([]);
  constructor(private svc: BookService){ this.load(); }
  load(){ this.svc.list().subscribe(bs => this.books.set(bs)); }
  search(){ this.svc.list(this.q).subscribe(bs => this.books.set(bs)); }
}
