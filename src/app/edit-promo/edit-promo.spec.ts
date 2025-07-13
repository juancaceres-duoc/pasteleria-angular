import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPromo } from './edit-promo';

describe('EditPromo', () => {
  let component: EditPromo;
  let fixture: ComponentFixture<EditPromo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPromo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPromo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});