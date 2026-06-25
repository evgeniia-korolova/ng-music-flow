import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePlaylistForm } from './create-playlist-form';
import { signal } from '@angular/core';
import { TracksStore } from '../../../entities/track/model/track.store';
import { Track } from '../../../entities/track/model/track.model';
import { vi } from 'vitest';
import { Router } from '@angular/router';
const mockTrackStore = {
  tracks: signal([]),
  loadTracks: () => {
    /* mock */
  },
};
describe('CreatePlaylistForm', () => {
  let component: CreatePlaylistForm;
  let fixture: ComponentFixture<CreatePlaylistForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePlaylistForm],
    })
      .overrideComponent(CreatePlaylistForm, {
        set: {
          providers: [{ provide: TracksStore, useValue: mockTrackStore }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CreatePlaylistForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should emit playlist and reset form on submit', () => {
  //   let emittedData: unknown;
  //   component.savedPlayList.subscribe((data) => (emittedData = data));
  //   component.playlistForm.setValue({ name: 'My list', description: 'My desc' });
  //   component.selectedTracks.set([{ id: '1' } as unknown as Track]);
  //   component.onSubmit();

  //   expect(emittedData).toEqual({
  //     name: 'My list',
  //     description: 'My desc',
  //     tracks: [{ id: '1' } as unknown],
  //   });
  //   expect(component.playlistForm.value.name).toBeNull();
  // });

  it('should call createPlaylist, navigate to custom tracks and reset form on submit', async () => {
    // 1. Инжектим реальный инстанс роутера из тестового модуля и вешаем на него шпиона
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    // 2. Настраиваем шпиона на метод Стора
    const createPlaylistSpy = vi
      .spyOn(component.playlistsStore, 'createPlaylist')
      .mockResolvedValue({ name: 'My list', description: 'My desc', tracks: [] });

    // 3. Заполняем форму данными (без id)
    component.playlistForm.setValue({ name: 'My list', description: 'My desc' });
    component.selectedTracks.set([{ id: '1' } as Track]);

    // 4. Вызываем onSubmit
    await component.onSubmit();

    // 5. Проверяем вызов Стора с чистым объектом LibraryPlaylist
    expect(createPlaylistSpy).toHaveBeenCalledWith({
      name: 'My list',
      description: 'My desc',
      tracks: [{ id: '1' } as Track],
    });

    // 6. 🔥 ПРОВЕРЯЕМ РОУТЕР: Навигация должна увести пользователя строго на кастомные треки!
    expect(navigateSpy).toHaveBeenCalledWith(['/library/custom-tracks']);

    // 7. Проверяем, что форма и чипсы успешно сбросились
    expect(component.playlistForm.value.name).toBeNull();
    expect(component.selectedTracks().length).toBe(0);
  });
});
