import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Calendar2Page } from './calendar2.page';

describe('Calendar2Page', () => {
  let component: Calendar2Page;
  let fixture: ComponentFixture<Calendar2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Calendar2Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Calendar2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
