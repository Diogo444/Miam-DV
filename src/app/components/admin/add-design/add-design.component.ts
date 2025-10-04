import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api/api.service';

@Component({
  selector: 'app-add-design',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-design.component.html',
  styleUrl: './add-design.component.scss'
})
export class AddDesignComponent {
  backgroundColor: string = '#333';
  titleColor: string = '#bc8623';
  elementColor: string = '#f1f1f1';

  constructor(private api: ApiService){}

  onSubmit() {
    this.api.addDesign(this.backgroundColor, this.titleColor, this.elementColor).subscribe();
  }

}
