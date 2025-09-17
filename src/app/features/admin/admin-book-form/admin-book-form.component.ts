
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../core/models/book';


@Component({
  selector: 'app-admin-book-form',
  standalone: true,
  imports: [CommonModule, FormsModule],

  templateUrl: './admin-book-form.component.html',
  styleUrls: ['./admin-book-form.component.css']
})
export class AdminBookFormComponent {
  id?: number; model: Partial<Book> = { available: true };
  constructor(private route: ActivatedRoute, private svc: BookService, private router: Router){
    const pid = this.route.snapshot.paramMap.get('id');
    if (pid){ this.id = Number(pid); this.svc.get(this.id).subscribe(b => this.model = b); }
  }
  save(){
    const op = this.id ? this.svc.update(this.id, this.model) : this.svc.create(this.model);
    op.subscribe({ next: _ => this.router.navigate(['/admin/books']), error: _ => alert('Save failed') });
  }
}
