
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../core/models/book';


@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],

  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent {
  book = signal<Book | null>(null);
  constructor(private route: ActivatedRoute, private svc: BookService){
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.svc.get(id).subscribe(b => this.book.set(b));
  }
}
