import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MoviesApi } from '../../services/movies-api';
import { setErrorMessage } from '../../../../shared/utils/set-error-message';

@Component({
  selector: 'app-create-movie',
  imports: [FormsModule],
  templateUrl: './create-movie.html',
  styleUrl: './create-movie.css',
})
export class CreateMovie {
  private readonly _moviesApi = inject(MoviesApi);

  title = signal<string>('');
  year = signal<number | undefined>(undefined);
  category = signal<string>('');
  description = signal<string>('');
 
  imagePreview = signal<string | undefined>(undefined);
  selectedFile = signal<File | undefined>(undefined);

  movieFormData = signal<FormData | undefined>(undefined);

  createMovieResource = rxResource({
    params: () => this.movieFormData(),
    stream: ({params}) => this._moviesApi.createMovie(params),
  })

  errorMessage = computed(()=> setErrorMessage(this.createMovieResource.error()))

  successMessage = computed(() => {
    const SUCCESS_CREATION = this.createMovieResource.hasValue();
    return SUCCESS_CREATION ? 'Filme criado com sucesso!' : undefined;
  })

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if(input.files && input.files[0]){
      const file = input.files[0];
      this.selectedFile.set(file);

      if(this.imagePreview()){
        URL.revokeObjectURL(this.imagePreview()!);
      }

      const objectUrl = URL.createObjectURL(file);

      this.imagePreview.set(objectUrl);
    }
  }

  salvar() {
    const formData = new FormData();

    formData.append('titulo', this.title());
    formData.append('descricao', this.description());
    formData.append('anoLancamento', this.year()?.toString() ?? '');
    formData.append('genero', this.category());
    formData.append('image', this.selectedFile() ?? '');
    
    this.movieFormData.set(formData);
  }

  cancelar() {
    console.log('Operação cancelada!');
  }
}
