import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StoresTabPage } from './stores-tab.page';

describe('StoresTabPage', () => {
  let component: StoresTabPage;
  let fixture: ComponentFixture<StoresTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoresTabPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StoresTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
