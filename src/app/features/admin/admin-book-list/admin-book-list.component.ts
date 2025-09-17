
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../core/models/book';


@Component({
  selector: 'app-admin-book-list',
  standalone: true,
  imports: [CommonModule, RouterLink],

  templateUrl: './admin-book-list.component.html',
  styleUrls: ['./admin-book-list.component.css']
})
export class AdminBookListComponent {
  books = signal<Book[]>([]);
  constructor(private svc: BookService, private router: Router){ this.load(); }
  load(){ this.svc.list().subscribe(bs => this.books.set(bs)); }
}
