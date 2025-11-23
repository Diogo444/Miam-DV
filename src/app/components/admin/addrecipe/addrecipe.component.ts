<<<<<<< HEAD
import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ApiService } from '../../../services/api/api.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-addrecipe',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './addrecipe.component.html',
  styleUrls: ['./addrecipe.component.scss'],
})
export class AddrecipeComponent implements OnDestroy {
  recipeForm: FormGroup;
  selectedFile: File | null = null;
  private destroy$ = new Subject<void>();

  constructor(private apiService: ApiService, fb: FormBuilder) {
    this.recipeForm = fb.group({
      name: [''],
      slug: [''],
      intro: [''],
      ingredients: [''],
      ustensiles: [''],
      preparation: [''],
      conseil: [''],
      presentation: [''],
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.recipeForm.get('name')!.value);
    formData.append('slug', this.recipeForm.get('slug')!.value);
    formData.append('intro', this.recipeForm.get('intro')!.value);
    formData.append('ingredients', this.recipeForm.get('ingredients')!.value);
    formData.append('ustensiles', this.recipeForm.get('ustensiles')!.value);
    formData.append('preparation', this.recipeForm.get('preparation')!.value);
    formData.append('conseil', this.recipeForm.get('conseil')!.value);
    formData.append('presentation', this.recipeForm.get('presentation')!.value);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.apiService
      .rec(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          alert('Recette ajoutée');
        },
        (error) => {
          alert("Erreur lors de l'ajout de la recette");
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
=======
import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ApiService } from '../../../services/api/api.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-addrecipe',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './addrecipe.component.html',
  styleUrls: ['./addrecipe.component.scss'],
})
export class AddrecipeComponent implements OnDestroy {
  recipeForm: FormGroup;
  selectedFile: File | null = null;
  private destroy$ = new Subject<void>();

  constructor(private apiService: ApiService, fb: FormBuilder) {
    this.recipeForm = fb.group({
      name: [''],
      slug: [''],
      intro: [''],
      ingredients: [''],
      ustensiles: [''],
      preparation: [''],
      conseil: [''],
      presentation: [''],
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.recipeForm.get('name')!.value);
    formData.append('slug', this.recipeForm.get('slug')!.value);
    formData.append('intro', this.recipeForm.get('intro')!.value);
    formData.append('ingredients', this.recipeForm.get('ingredients')!.value);
    formData.append('ustensiles', this.recipeForm.get('ustensiles')!.value);
    formData.append('preparation', this.recipeForm.get('preparation')!.value);
    formData.append('conseil', this.recipeForm.get('conseil')!.value);
    formData.append('presentation', this.recipeForm.get('presentation')!.value);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.apiService
      .rec(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          alert('Recette ajoutée');
        },
        (error) => {
          alert("Erreur lors de l'ajout de la recette");
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
>>>>>>> afe05af085bf6474cb15d6eaf7a64896e5a8f91a
