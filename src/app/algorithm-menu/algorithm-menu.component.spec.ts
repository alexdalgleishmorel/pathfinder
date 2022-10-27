import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgorithmMenuComponent } from './algorithm-menu.component';

describe('AlgorithmMenuComponent', () => {
  let component: AlgorithmMenuComponent;
  let fixture: ComponentFixture<AlgorithmMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlgorithmMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlgorithmMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
