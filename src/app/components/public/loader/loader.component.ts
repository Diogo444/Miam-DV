<<<<<<< HEAD
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
=======
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
>>>>>>> afe05af085bf6474cb15d6eaf7a64896e5a8f91a
