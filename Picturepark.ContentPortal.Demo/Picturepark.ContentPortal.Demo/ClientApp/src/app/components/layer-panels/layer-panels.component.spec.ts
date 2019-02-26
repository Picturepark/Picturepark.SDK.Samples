import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerPanelsComponent } from './layer-panels.component';

describe('LayerPanelsComponent', () => {
  let component: LayerPanelsComponent;
  let fixture: ComponentFixture<LayerPanelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerPanelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerPanelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
