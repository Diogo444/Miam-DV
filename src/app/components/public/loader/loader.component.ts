import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-loader',
    imports: [],
    templateUrl: './loader.component.html',
    styleUrl: './loader.component.scss'
})
export class LoaderComponent implements AfterViewInit {
  @ViewChild('loadingText', { static: false }) loadingText!: ElementRef;

ngAfterViewInit() {
  this.loadingText.nativeElement.style.display = 'none';
}

}
