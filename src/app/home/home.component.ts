import { Component } from '@angular/core';
import { ApiServiceService } from '../api-service.service';
import { TableViewComponent } from '../table-view/table-view.component';
import { Router } from '@angular/router';
import { constants } from '../../constants/constants';
import { catchError, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TableViewComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  private destroy$ = new Subject<void>();
  searchText = '';
  rowData: any[] = [];
  popupMessage = '';
  isPopupVisible = false;
  placeHolder : string = constants.placeholderForSearch


  constructor(private apiService: ApiServiceService,
    private router: Router
  ) {}

  onSearch(searchText: string): void {
    if(searchText.length > 2) {
      this.apiService.getUsers(searchText).pipe(
        takeUntil(this.destroy$), 
        catchError((error) => {
          if (error.status === 404) {
            this.showPopup(error.error);
          } else {
            this.showPopup(constants.SERVER_NOT_AVAILABLE);
            console.error('Error fetching users:', error);
          }
          throw error; 
        })
      )
      .subscribe((data: any) => {
        // If data is { users: [...] }, extract the array
        const usersArray = Array.isArray(data) ? data : data?.users;
        this.apiService.setUsers(usersArray);
        this.router.navigate(['/list-users'], { state: { data: usersArray } });
      });
    }else{
      this.showPopup(constants.MIN_SEARCH_TEXT_LENGTH);
    }
  }
  
  showPopup(message: string): void {
    this.popupMessage = message;
    this.isPopupVisible = true;
  }

  closePopup(): void {
    this.isPopupVisible = false;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
