import { Component, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-movie',
  imports: [FormsModule],
  templateUrl: './create-movie.html',
  styleUrl: './create-movie.css',
})
export class CreateMovie {
  title = signal<string>('');
  year = signal<number | undefined>(undefined);
  category = signal<string>('');
  description = signal<string>('');
 
  imagePreview = signal<string | undefined>(undefined);
  selectedFile = signal<File | undefined>(undefined);

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
    console.log('title', this.title());
    console.log('year', this.year());
    console.log('category', this.category());
    console.log('description', this.description());
    
    console.log('imagePreview', this.imagePreview());
    console.log('selectedFile', this.selectedFile());

    console.log('Filme salvo!');
  }

  cancelar() {
    console.log('Operação cancelada!');
  }
}
