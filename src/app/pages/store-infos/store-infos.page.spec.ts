import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StoreInfosPage } from './store-infos.page';

describe('StoreInfosPage', () => {
  let component: StoreInfosPage;
  let fixture: ComponentFixture<StoreInfosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreInfosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StoreInfosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
