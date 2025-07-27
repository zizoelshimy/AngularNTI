import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PostsService } from '../services/posts.service';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'], // fixed typo
  providers: [PostsService]
})
export class PostsComponent implements OnInit {
  posts: any[] = [];

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts(): void {
    this.postsService.getPosts().subscribe({
      next: (res) => {
        console.log(res);
        this.posts = res;
      },
      error: (err) => {
        console.error('Error fetching posts:', err);
      },
      complete: () => {
        console.log('Posts fetched successfully');
      }
    });
  }
}
