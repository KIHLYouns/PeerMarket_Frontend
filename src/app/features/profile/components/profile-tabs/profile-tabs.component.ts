import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-profile-tabs',
  standalone: false,
  templateUrl: './profile-tabs.component.html',
  styleUrls: ['./profile-tabs.component.scss']
})
export class ProfileTabsComponent {
  @Input() tabs: { id: string, label: string }[] = [];
  @Input() activeTab: string = '';
  @Output() tabChanged = new EventEmitter<string>();

  selectTab(tabId: string): void {
    if (tabId !== this.activeTab) {
      this.tabChanged.emit(tabId);
    }
  }
}
