import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StoreInfoPage } from './store-info.page';

describe('StoreInfoPage', () => {
  let component: StoreInfoPage;
  let fixture: ComponentFixture<StoreInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StoreInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
