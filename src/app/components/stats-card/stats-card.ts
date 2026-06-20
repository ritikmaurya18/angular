import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-card.html',
})
export class StatsCardComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) value: string | number = 0;
  @Input() icon = '';
  @Input() color = 'blue';
}
