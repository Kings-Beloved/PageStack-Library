import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { catchError, throwError, timeout } from 'rxjs';

@Service()
export class Books {

    private http = inject(HttpClient);

    getBooks(searchQuery: string = 'bestseller'){
        const url = `https://openlibrary.org/search.json?q=${searchQuery}&limit=12`;
        return this.http.get(url)
    }


allBook(query: string): any {
    const formattedQuery = encodeURIComponent(query);
    
    // Add &has_fulltext=true and request ebook_access field explicitly
    const searchUrl = `https://openlibrary.org/search.json?q=${formattedQuery}&has_fulltext=true&fields=key,title,author_name,cover_i,public_scan_b,has_fulltext,ia,ebook_access`;
    
    return this.http.get(searchUrl);
  }


    getBookDetails(workKey:string){
        const workId = workKey.replace('/works/', '');
        return this.http.get(`https://openlibrary.org/works/${workId}.json?fields=title,covers,description`);
    }
}
