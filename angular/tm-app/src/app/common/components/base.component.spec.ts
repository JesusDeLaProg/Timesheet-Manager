import { TestBed, async } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { BaseComponent } from "./base.component";
import { Component } from "@angular/core";

@Component({
  selector: "tm-base-component-impl",
  template: "<p>It Works!</p>"
})
class BaseImplComponent extends BaseComponent {
  public get canDeactivate(): boolean {
    return true;
  }
}

describe("BaseComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [BaseComponent]
    }).compileComponents();
  }));

  it("should create the app", () => {
    const fixture = TestBed.createComponent(BaseImplComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'tm-app'`, () => {
    const fixture = TestBed.createComponent(BaseImplComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual("tm-app");
  });

  it("should render title", () => {
    const fixture = TestBed.createComponent(BaseImplComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector("p").textContent).toContain("It Works!");
  });
});
