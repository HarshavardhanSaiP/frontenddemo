import { TestBed } from '@angular/core/testing';
import { DetailsComponent } from './details.component';
import { ActivatedRoute } from '@angular/router';

describe('DetailsComponent', () => {
  let component: DetailsComponent;

  beforeEach(async () => {
    // Mock ActivatedRoute with a snapshot paramMap
    const mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: (key: string) => '123', // Mock 'id' parameter
        },
      },
    };

    // Mock history.state with fake recipe data
    Object.defineProperty(window, 'history', {
      value: {
        state: {
          data: { name: 'Test Recipe', servings: 4 },
        },
      },
    });

    await TestBed.configureTestingModule({
      imports: [DetailsComponent], 
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute,
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve the id from ActivatedRoute', () => {
    component.ngOnInit();
    expect(component.id).toEqual('123'); // Check if the correct 'id' is retrieved
  });

  it('should retrieve recipe data from history.state', () => {
    component.ngOnInit();
    expect(component.recipe).toEqual({ name: 'Test Recipe', servings: 4 }); // Validate recipe data
  });
});
