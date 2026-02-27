import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PresenterState } from '../../features/presenter-picker/models';

const GIST_API = 'https://api.github.com/gists';

@Injectable({ providedIn: 'root' })
export class GistService {
  private readonly gistId = environment.gistId;
  private readonly token = environment.githubToken;
  private readonly fileName = environment.gistFileName;

  /**
   * Lê o conteúdo do Gist e retorna o PresenterState parseado.
   */
  async read(): Promise<PresenterState> {
    const res = await fetch(`${GIST_API}/${this.gistId}`, {
      headers: this.headers(),
    });

    if (!res.ok) {
      throw new Error(`Falha ao ler Gist: ${res.status} ${res.statusText}`);
    }

    const gist = await res.json();
    const fileContent = gist.files?.[this.fileName]?.content;

    if (!fileContent) {
      throw new Error(`Arquivo "${this.fileName}" não encontrado no Gist`);
    }

    return JSON.parse(fileContent) as PresenterState;
  }

  /**
   * Atualiza o conteúdo do Gist com o novo estado.
   */
  async update(state: PresenterState): Promise<void> {
    const res = await fetch(`${GIST_API}/${this.gistId}`, {
      method: 'PATCH',
      headers: this.headers(),
      body: JSON.stringify({
        files: {
          [this.fileName]: {
            content: JSON.stringify(state, null, 2),
          },
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Falha ao atualizar Gist: ${res.status} ${res.statusText}`);
    }
  }

  private headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    };
  }
}
