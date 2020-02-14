import { HostListener, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

export abstract class BaseComponent implements OnDestroy {
  protected readonly disposer = new Subscription();

  public abstract get canDeactivate(): boolean;

  @HostListener("window:beforeunload", ["$event"])
  beforeUnload($event: any) {
    if (!this.canDeactivate) {
      $event.returnValue = "Confirmer avant de quitter";
    }
  }

  ngOnDestroy(): void {
    this.disposer.unsubscribe();
  }
}
