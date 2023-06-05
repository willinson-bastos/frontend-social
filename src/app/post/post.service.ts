import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Post } from './post';
import { PostCriar } from './post.criar';


@Injectable({
    providedIn: 'root'
})
export class PostService {

    private API_URL = 'http://localhost:3000/home'

    constructor(private http: HttpClient) { }


    createPost(post: PostCriar): Observable<Post> {
        console.log(this.API_URL);
        return this.http.post<Post>(this.API_URL, post);
    }

    readAllPosts(): Observable<Post[]> {
        console.log(`${this.API_URL}/posts`);
        return this.http.get<Post[]>(`${this.API_URL}/posts`);
    }

    deletePost(id: number): Observable<void> {
        const url = `${this.API_URL}/${id}`;
        console.log(url);
        return this.http.delete<void>(url);
    }


}