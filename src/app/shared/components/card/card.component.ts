import { Component, Input } from "@angular/core";

export type CardVariant = "default" | "primary" | "outline" | "ghost" | "danger";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"],
})
export class CardComponent {
  @Input() variant: CardVariant = "default";
}
